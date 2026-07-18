"use client";

import { setLanguageCookie } from "@/lib/cookies";
import { Lang } from "@/lib/i18n";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LanguageSwitcher({ languages }: { languages: Lang[] }) {
  const currentLocale = useLocale();

  const [selected, setSelected] = useState(languages.find((l) => l.code === currentLocale) || languages[0]);

  const router = useRouter();

  const handleChange = async (language: Lang) => {
    setSelected(language);
    const newLocale = language.code;

    await setLanguageCookie(newLocale);

    router.refresh();
  };

  return (
    <div className="w-32">
      <Listbox value={selected} onChange={handleChange}>
        <ListboxButton className="cb-btn cb-btn-sm relative w-full justify-between pr-8 text-left">
          {selected.name}
          <ChevronDownIcon className="group pointer-events-none absolute top-2.5 right-2.5 size-4" aria-hidden="true" />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className="cb-card z-50 w-[var(--button-width)] p-1 transition duration-100 ease-in [--anchor-gap:var(--spacing-1)] focus:outline-none data-[leave]:data-[closed]:opacity-0"
        >
          {languages.map((lang) => (
            <ListboxOption
              key={lang.code}
              value={lang}
              className="cb-list-row group cursor-pointer items-center px-2 py-1.5 select-none data-[focus]:bg-[var(--cb-bg-3)]"
            >
              <CheckIcon className="invisible size-4 group-data-[selected]:visible" />
              <div className="cb-list-title">{lang.name}</div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
