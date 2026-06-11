import { EMAIL_HREF } from "@/app/content/company";

type ContactLinkProps = React.ComponentPropsWithoutRef<"a">;

export function ContactLink({ children, ...props }: ContactLinkProps) {
  return (
    <a href={EMAIL_HREF} {...props}>
      {children}
    </a>
  );
}
