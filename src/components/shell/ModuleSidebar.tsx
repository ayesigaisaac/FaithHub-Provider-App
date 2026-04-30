import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { ModuleCard } from '@/components/ui/ModuleCard';
import { SubItemRow } from '@/components/ui/SubItemRow';
import { moduleSidebarConfig } from '@/navigation/moduleSidebarConfig';

interface ModuleSidebarProps {
  onClose?: () => void;
}

export function ModuleSidebar({ onClose }: ModuleSidebarProps) {
  const [openModule, setOpenModule] = useState<string | null>('CORE');

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-[#f8faf9]">
      <div className="border-b border-slate-200 px-5 py-5">
        <BrandLogo variant="landscape" alt="FaithHub Provider" className="h-10 w-auto" />
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-label="Module Sidebar">
        {moduleSidebarConfig.map((module) => {
          const isOpen = openModule === module.title;

          return (
            <section key={module.title} className="space-y-2">
              <ModuleCard
                title={module.title}
                icon={module.icon}
                isOpen={isOpen}
                onToggle={() => setOpenModule((prev) => (prev === module.title ? null : module.title))}
              />

              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.ul
                    key={`${module.title}-items`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="space-y-1 overflow-hidden pl-2"
                  >
                    {module.items.map((item, index) => (
                      <motion.li
                        key={item.route}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16, delay: index * 0.02 }}
                      >
                        <SubItemRow
                          title={item.label}
                          description={item.description}
                          route={item.route}
                          icon={item.icon}
                          onClose={onClose}
                        />
                      </motion.li>
                    ))}
                  </motion.ul>
                ) : null}
              </AnimatePresence>
            </section>
          );
        })}
      </nav>
    </aside>
  );
}
