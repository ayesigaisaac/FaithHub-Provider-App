import { BadgeCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import { ProviderPageScaffold } from '@/components/provider/ProviderPageScaffold';
import { useAuth } from '@/auth/useAuth';
import type { ProviderOnboardingDraft } from '@/auth/types';

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
    resetOnboarding,
    refreshOnboarding,
    isOnboardingComplete,
  } = useAuth();

  const [step, setStep] = useState<StepIndex>(0);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitIntent, setSubmitIntent] = useState<'submit' | 'submit-and-continue' | null>(null);
  const [hasAutoResumed, setHasAutoResumed] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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

  const markTouched = (key: keyof ProviderOnboardingDraft) => {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  };

  const stepGuidance = useMemo(() => {
    if (step === 0) return 'Start with your organization basics to unlock the rest of setup.';
    if (step === 1) return 'Add a reachable contact so verification and support can reach your team.';
    if (step === 2) return 'Complete profile context so your ministry appears clearly across FaithHub.';
    if (canSubmit) return 'Everything is valid. Submit onboarding to begin verification.';
    return 'Review and complete missing fields, then submit onboarding.';
  }, [canSubmit, step]);

  const setupChecklist = useMemo(
    () => [
      { label: 'Organization name', done: validation.organizationName, step: 0 as StepIndex },
      { label: 'Primary contact', done: validation.contactName && validation.contactEmail && validation.contactPhone, step: 1 as StepIndex },
      { label: 'Profile context', done: validation.city && validation.mission && validation.website, step: 2 as StepIndex },
      { label: 'Terms agreement', done: validation.agreedToTerms, step: 3 as StepIndex },
    ],
    [validation],
  );

  const saveDraft = async () => {
    try {
      await saveOnboardingDraft(onboardingDraft);
      setNotice('Draft saved. You can safely continue later.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save draft right now.');
    }
  };

  const resetDraft = async () => {
    try {
      await resetOnboarding();
      setStep(0);
      setNotice('Draft reset. You can start onboarding again.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to reset onboarding right now.');
    }
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

    setSubmitIntent('submit');
    setIsSubmitting(true);
    try {
      await submitOnboarding();
      setNotice('Onboarding submitted. Awaiting verification approval.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to submit onboarding.');
    } finally {
      setIsSubmitting(false);
      setSubmitIntent(null);
    }
  };

  const submitAndContinueToProfile = async () => {
    if (!canSubmit) {
      setNotice('Complete all required fields before submission.');
      return;
    }
    if (onboardingStatus === 'submitted') {
      navigate('/faithhub/provider/profile-settings');
      return;
    }
    setSubmitIntent('submit-and-continue');
    setIsSubmitting(true);
    try {
      await submitOnboarding();
      setNotice('Onboarding submitted. Continue by completing profile settings.');
      navigate('/faithhub/provider/profile-settings');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to submit onboarding.');
    } finally {
      setIsSubmitting(false);
      setSubmitIntent(null);
    }
  };

  useEffect(() => {
    if (isOnboardingComplete) {
      navigate('/faithhub/provider/dashboard', { replace: true });
    }
  }, [isOnboardingComplete, navigate]);

  useEffect(() => {
    if (hasAutoResumed) return;
    if (onboardingStatus === 'in_progress' || onboardingStatus === 'not_started') {
      setStep(resumeStep);
      setHasAutoResumed(true);
    }
  }, [hasAutoResumed, onboardingStatus, resumeStep]);

  if (isOnboardingComplete) {
    return null;
  }

  return (
    <ProviderPageScaffold
      icon={<BadgeCheck className="h-6 w-6" />}
      title="Provider Onboarding"
      subtitle="Complete a short setup flow, save progress anytime, and finish profile readiness in one pass."
      tags={
        <>
          <Chip label={`Status: ${onboardingStatus.replace('_', ' ')}`} color={onboardingStatus === 'submitted' ? 'warning' : 'default'} />
          <Chip label={`Completion: ${completion}%`} color={completion === 100 ? 'success' : 'primary'} />
          <Chip label={`Resume step: ${STEPS[resumeStep]}`} />
        </>
      }
      pulse={<Alert severity="info">{stepGuidance}</Alert>}
    >
      <Stack spacing={2.5}>

        {notice ? <Alert severity="info">{notice}</Alert> : null}

        {onboardingStatus === 'submitted' ? (
          <Card>
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6" fontWeight={800}>Submission Received</Typography>
                <Typography variant="body2" color="text.secondary">
                  Your onboarding is submitted and pending verification. You can refresh status while back-office review is in progress.
                </Typography>
                <Stack direction="row" spacing={1.2}>
                  <Button
                    variant="outlined"
                    onClick={() => void refreshOnboarding()}
                  >
                    Refresh status
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/faithhub/provider/profile-settings')}
                  >
                    Complete profile settings
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Stack spacing={1.2} mb={2.5}>
                <Typography variant="subtitle2" fontWeight={800}>
                  Setup checklist
                </Typography>
                {setupChecklist.map((item) => (
                  <Stack key={item.label} direction="row" spacing={1.2} alignItems="center" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    {item.done ? (
                      <Chip size="small" color="success" label="Complete" />
                    ) : (
                      <Button size="small" variant="text" onClick={() => setStep(item.step)}>
                        Go to step
                      </Button>
                    )}
                  </Stack>
                ))}
              </Stack>

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
                      onBlur={() => markTouched('organizationName')}
                      error={!validation.organizationName && Boolean(touched.organizationName)}
                      helperText={!validation.organizationName && Boolean(touched.organizationName) ? 'Organization name must be at least 2 characters.' : ' '}
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
                      onBlur={() => markTouched('contactName')}
                      error={!validation.contactName && Boolean(touched.contactName)}
                      helperText={!validation.contactName && Boolean(touched.contactName) ? 'Contact name must be at least 2 characters.' : ' '}
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
                      onBlur={() => markTouched('contactEmail')}
                      error={!validation.contactEmail && Boolean(touched.contactEmail)}
                      helperText={!validation.contactEmail && Boolean(touched.contactEmail) ? 'Enter a valid email address.' : ' '}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Contact phone"
                      value={onboardingDraft.contactPhone}
                      onChange={(event) => updateDraft('contactPhone', event.target.value)}
                      onBlur={() => markTouched('contactPhone')}
                      error={!validation.contactPhone && Boolean(touched.contactPhone)}
                      helperText={!validation.contactPhone && Boolean(touched.contactPhone) ? 'Phone number must be at least 7 characters.' : ' '}
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
                      onBlur={() => markTouched('city')}
                      error={!validation.city && Boolean(touched.city)}
                      helperText={!validation.city && Boolean(touched.city) ? 'City must be at least 2 characters.' : ' '}
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
                      onBlur={() => markTouched('website')}
                      error={!validation.website && Boolean(touched.website)}
                      helperText={!validation.website && Boolean(touched.website) ? 'Use a valid website URL.' : 'Optional'}
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
                      onBlur={() => markTouched('mission')}
                      error={!validation.mission && Boolean(touched.mission)}
                      helperText={!validation.mission && Boolean(touched.mission) ? 'At least 20 characters required.' : 'At least 20 characters'}
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
                <Button variant="outlined" onClick={() => void saveDraft()}>Save draft</Button>
                <Button variant="outlined" onClick={() => setStep(resumeStep)}>Jump to resume step</Button>
                <Box sx={{ flex: 1 }} />
                <Button variant="text" color="warning" onClick={() => void resetDraft()}>Reset draft</Button>
                <Button variant="outlined" disabled={step === 0} onClick={() => setStep((prev) => Math.max(0, prev - 1) as StepIndex)}>
                  Back
                </Button>
                {step < 3 ? (
                  <Button variant="contained" disabled={!canContinue} onClick={() => setStep((prev) => Math.min(3, prev + 1) as StepIndex)}>
                    Continue setup
                  </Button>
                ) : (
                  <>
                    <Button variant="outlined" disabled={!canSubmit || isSubmitting} onClick={submit}>
                      {isSubmitting && submitIntent === 'submit' ? 'Submitting...' : 'Submit onboarding'}
                    </Button>
                    <Button variant="contained" color="success" disabled={!canSubmit || isSubmitting} onClick={submitAndContinueToProfile}>
                      {isSubmitting && submitIntent === 'submit-and-continue' ? 'Submitting...' : 'Submit and continue to profile'}
                    </Button>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </ProviderPageScaffold>
  );
}
