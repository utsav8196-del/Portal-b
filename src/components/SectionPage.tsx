import type { ReactNode } from "react";

type SectionPageProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

const SectionPage = ({ title, description, children }: SectionPageProps) => {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-600">
          Page
        </p>
        <h1
          className="mt-3 text-4xl font-black text-slate-950 md:text-5xl"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-3 max-w-2xl text-base font-medium text-slate-500">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
};

export default SectionPage;
