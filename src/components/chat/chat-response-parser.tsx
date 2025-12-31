'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

type ChatResponseParserProps = {
  content: string;
};

export default function ChatResponseParser({ content }: ChatResponseParserProps) {
  // Split by markdown-style headers (###)
  const sections = content.split(/\n###\s+/).map(s => s.trim());

  if (sections.length <= 1) {
    return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
  }

  return (
    <div className="text-sm">
      {sections[0] && (
        <p className="mb-4 leading-relaxed whitespace-pre-wrap">{sections[0]}</p>
      )}

      <Accordion type="single" collapsible className="w-full">
        {sections.slice(1).map((section, index) => {
          const lines = section.split('\n');
          const title = lines[0] || 'Details';
          const sectionContent = lines.slice(1).join('\n').trim();

          if (!sectionContent) return null;

          return (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{title}</AccordionTrigger>
              <AccordionContent>
                <div className="leading-relaxed whitespace-pre-wrap">{sectionContent}</div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
