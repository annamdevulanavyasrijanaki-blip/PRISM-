import { cn } from "../lib/utils";

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const templates = [
  { id: "modern", name: "Modern", description: "Clean, two-column layout with blue accents" },
  { id: "professional", name: "Professional", description: "Classic, centered serif layout for experience" },
  { id: "minimal", name: "Minimal", description: "Sophisticated single-column aesthetic" },
  { id: "creative", name: "Creative", description: "Bold, sidebar-driven design for impact" },
  { id: "executive", name: "Executive", description: "Luxury density for leadership profiles" },
  { id: "technical", name: "Technical", description: "Terminal-style monospace for engineers" },
  { id: "academic", name: "Academic", description: "Traditional serif for research & CVs" },
  { id: "indigo", name: "Indigo", description: "Modern sidebar with vibrant gradients" },
  { id: "brutalist", name: "Brutalist", description: "High-contrast monochrome bold aesthetic" },
  { id: "elegant", name: "Elegant", description: "Luxury whitespace & centered typography" },
  { id: "compact", name: "Compact", description: "High density for senior career summaries" },
  { id: "designer", name: "Designer", description: "Creative grid with vibrant dark accents" },
];

export default function TemplateSelector({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 pb-4">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t.id)}
          className={cn(
            "p-4 text-left rounded-2xl border-2 transition-all relative overflow-hidden group h-full",
            selected === t.id
              ? "border-blue-600 bg-blue-50/50 shadow-md ring-4 ring-blue-500/5"
              : "border-gray-100 bg-white hover:border-gray-200"
          )}
        >
          <p className={cn(
            "font-black text-[10px] uppercase tracking-tighter mb-1 transition-colors",
            selected === t.id ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
          )}>
            {t.name}
          </p>
          <p className="text-[10px] text-gray-500 leading-tight font-medium">{t.description}</p>
          {selected === t.id && (
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
          )}
        </button>
      ))}
    </div>
  );
}
