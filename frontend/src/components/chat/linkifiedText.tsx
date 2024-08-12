import { cn } from '@/lib/utils';

const linkifyText = (text: string, isOwn:boolean) => {
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const phonePattern = /(\+?\d{1,3}?[-.\s]?(\(?\d{1,4}?\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/g;

  const parts = text.split(/(\b(?:https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)|(\+?\d{1,3}?[-.\s]?(\(?\d{1,4}?\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9})/gi);
  const className = cn('underline', !isOwn && "text-brand-p2")
  return parts.map((part, index) => {
    if (urlPattern.test(part)) {
      return (
        <a key={index} className={className} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    if (emailPattern.test(part)) {
      return (
        <a key={index} className={className} href={`mailto:${part}`}>
          {part}
        </a>
      );
    }
    if (phonePattern.test(part)) {
      return (
        <a key={index} className={className} href={`tel:${part}`}>
          {part}
        </a>
      );
    }
    return (<span key={index}>{part}</span>);
  });
};

const LinkifiedText = ({ text, isOwn }: { text: string, isOwn: boolean }) => {
  return <>{linkifyText(text, isOwn)}</>;
};

export default LinkifiedText;
