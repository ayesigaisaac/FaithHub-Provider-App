import { BadgeCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ProviderPageTitle } from '@/components/provider/ProviderPageTitle';
import { useAuth } from '@/auth/useAuth';
import type { ProviderOnboardingDraft } from '@/auth/types';
import { DEFAULT_ONBOARDING_DRAFT } from '@/auth/storage';

const STEPS = ['Organization', 'Contact', 'Profile', 'Review'] as const;

type StepIndex = 0 | 1 | 2 | 3;

function isValidUrl(url: string) {
  if (!url) return true;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function validateDraft(draft: ProviderOnboardingDraft) {
  return {
    organizationName: draft.organizationName.trim().length >= 2,
    contactName: draft.contactName.trim().length >= 2,
    contactEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contactEmail.trim()),
    contactPhone: draft.contactPhone.trim().length >= 7,
    city: draft.city.trim().length >= 2,
    mission: draft.mission.trim().length >= 20,
    website: isValidUrl(draft.website.trim()),
    agreedToTerms: draft.agreedToTerms,
  };
}

export default function ProviderOnboardingPage() {
  const navigate = useNavigate();
  const {
    onboardingDraft,
    onboardingStatus,
    setOnboardingDraft,
    setOnboardingStatus,
    saveOnboardingDraft,
    submitOnboarding,
    isOnboardingComplete,
  } = useAuth();

  const [step, setStep] = useState<StepIndex>(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validation = useMemo(() => validateDraft(onboardingDraft), [onboardingDraft]);
  const completion = useMemo(() => {
    const checks = Object.values(validation);
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [validation]);

  const canContinue = useMemo(() => {
    if (step === 0) return validation.organizationName;
    if (step === 1) return validation.contactName && validation.contactEmail && validation.contactPhone;
    if (step === 2) return validation.city && validation.mission && validation.website;
    return true;
  }, [step, validation]);

  const canSubmit = useMemo(() => Object.values(validation).every(Boolean), [validation]);
  const resumeStep = useMemo<StepIndex>(() => {
    if (!validation.organizationName) return 0;
    if (!validation.contactName || !validation.contactEmail || !validation.contactPhone) return 1;
    if (!validation.city || !validation.mission || !validation.website) return 2;
    if (!validation.agreedToTerms) return 3;
    return 3;
  }, [validation]);

  const updateDraft = <K extends keyof ProviderOnboardingDraft>(key: K, value: ProviderOnboardingDraft[K]) => {
    const next = { ...onboardingDraft, [key]: value };
    setOnboardingDraft(next);
    if (onboardingStatus === 'not_started') {
      setOnboardingStatus('in_progress');
    }
    setNotice(null);
  };

  const saveDraft = async () => {
    try {
      await saveOnboardingDraft(onboardingDraft);
      setNotice('Draft saved. You can safely continue later.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save draft right now.');
    }
  };

  const resetDraft = () => {
    setOnboardingDraft(DEFAULT_ONBOARDING_DRAFT);
    setOnboardingStatus('not_started');
    setStep(0);
    setNotice('Draft reset. You can start onboarding again.');
  };

  const submit = async () => {
    if (!canSubmit) {
      setNotice('Complete all required fields before submission.');
      return;
    }
    if (onboardingStatus === 'submitted') {
      setNotice('Onboarding has already been submitted and is awaiting review.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitOnboarding();
      setNotice('Onboarding submitted. Awaiting verification approval.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to submit onboarding.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const approve = () => {
    setOnboardingStatus('approved');
    navigate('/faithhub/provider/dashboard', { replace: true });
  };

  if (isOnboardingComplete) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
      <Stack spacing={2.5}>
        <Card>
          <CardContent>
            <ProviderPageTitle
              icon={<BadgeCheck className="h-6 w-6" />}
              title="Provider Onboarding"
              subtitle="Set up your provider workspace with validated details, saved progress, and launch readiness checks."
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mt={2}>
              <Chip label={`Status: ${onboardingStatus.replace('_', ' ')}`} color={onboardingStatus === 'submitted' ? 'warning' : 'default'} />
              <Chip label={`Completion: ${completion}%`} color={completion === 100 ? 'success' : 'primary'} />
              <Chip label={`Resume step: ${STEPS[resumeStep]}`} />
            </Stack>
          </CardContent>
        </Card>

        {notice ? <Alert severity="info">{notice}</Alert> : null}

        {onboardingStatus === 'submitted' ? (
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={800}>Submission Received</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your onboarding is submitted and pending verification. In production, this would await back-office review.
                </Typography>
                <Stack direction="row" spacing={1.2}>
                  <Button variant="outlined" onClick={() => setOnboardingStatus('in_progress')}>Edit and resubmit</Button>
                  <Button variant="contained" onClick={approve}>Approve and enter dashboard</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Stepper activeStep={step} alternativeLabel sx={{ mb: 3 }}>
                {STEPS.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {step === 0 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label="Organization name"
                      value={onboardingDraft.organizationName}
                      onChange={(event) => updateDraft('organizationName', event.target.value)}
                      error={!validation.organizationName && onboardingDraft.organizationName.length > 0}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel id="org-type-label">Organization type</InputLabel>
                      <Select
                        labelId="org-type-label"
                        label="Organization type"
                        value={onboardingDraft.organizationType}
                        onChange={(event) => updateDraft('organizationType', event.target.value as ProviderOnboardingDraft['organizationType'])}
                      >
                        <MenuItem value="church">Church</MenuItem>
                        <MenuItem value="ministry">Ministry</MenuItem>
                        <MenuItem value="events">Events-led</MenuItem>
                        <MenuItem value="digital">Digital-first</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              ) : null}

              {step === 1 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Primary contact name"
                      value={onboardingDraft.contactName}
                      onChange={(event) => updateDraft('contactName', event.target.value)}
                      error={!validation.contactName && onboardingDraft.contactName.length > 0}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="email"
                      label="Contact email"
                      value={onboardingDraft.contactEmail}
                      onChange={(event) => updateDraft('contactEmail', event.target.value)}
                      error={!validation.contactEmail && onboardingDraft.contactEmail.length > 0}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Contact phone"
                      value={onboardingDraft.contactPhone}
                      onChange={(event) => updateDraft('contactPhone', event.target.value)}
                      error={!validation.contactPhone && onboardingDraft.contactPhone.length > 0}
                    />
                  </Grid>
                </Grid>
              ) : null}

              {step === 2 ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Country"
                      value={onboardingDraft.country}
                      onChange={(event) => updateDraft('country', event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="City"
                      value={onboardingDraft.city}
                      onChange={(event) => updateDraft('city', event.target.value)}
                      error={!validation.city && onboardingDraft.city.length > 0}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Primary language"
                      value={onboardingDraft.primaryLanguage}
                      onChange={(event) => updateDraft('primaryLanguage', event.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Website"
                      placeholder="https://example.org"
                      value={onboardingDraft.website}
                      onChange={(event) => updateDraft('website', event.target.value)}
                      error={!validation.website}
                      helperText={!validation.website ? 'Use a valid website URL.' : 'Optional'}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      minRows={4}
                      label="Mission summary"
                      value={onboardingDraft.mission}
                      onChange={(event) => updateDraft('mission', event.target.value)}
                      error={!validation.mission && onboardingDraft.mission.length > 0}
                      helperText="At least 20 characters"
                    />
                  </Grid>
                </Grid>
              ) : null}

              {step === 3 ? (
                <Stack spacing={2}>
                  <Alert severity={canSubmit ? 'success' : 'warning'}>
                    {canSubmit
                      ? 'All required onboarding details are valid. You can submit now.'
                      : 'Some required fields are incomplete or invalid. Go back and finish them.'}
                  </Alert>
                  <Typography variant="body2"><strong>Organization:</strong> {onboardingDraft.organizationName || 'Not set'}</Typography>
                  <Typography variant="body2"><strong>Contact:</strong> {onboardingDraft.contactName || 'Not set'} ({onboardingDraft.contactEmail || 'No email'})</Typography>
                  <Typography variant="body2"><strong>Location:</strong> {onboardingDraft.city || 'Not set'}, {onboardingDraft.country || 'Not set'}</Typography>
                  <FormControlLabel
                    control={<Switch checked={onboardingDraft.agreedToTerms} onChange={(event) => updateDraft('agreedToTerms', event.target.checked)} />}
                    label="I confirm these details are accurate and I agree to onboarding terms"
                  />
                </Stack>
              ) : null}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} mt={3}>
                <Button variant="text" color="warning" onClick={resetDraft}>Reset draft</Button>
                <Button variant="outlined" onClick={() => void saveDraft()}>Save draft</Button>
                <Button variant="outlined" onClick={() => setStep(resumeStep)}>Jump to resume step</Button>
                <Box sx={{ flex: 1 }} />
                <Button variant="outlined" disabled={step === 0} onClick={() => setStep((prev) => Math.max(0, prev - 1) as StepIndex)}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button variant="contained" disabled={!canContinue} onClick={() => setStep((prev) => Math.min(3, prev + 1) as StepIndex)}>
                    Continue
                  </Button>
                ) : (
                  <Button variant="contained" color="success" disabled={!canSubmit || isSubmitting} onClick={submit}>
                    {isSubmitting ? 'Submitting...' : 'Submit onboarding'}
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
