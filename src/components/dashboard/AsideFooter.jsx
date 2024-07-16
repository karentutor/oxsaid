import React from "react";
import AsideFooterLink from "./AsideFooterLink";

const AsideFooter = () => (
  <div className="text-xs text-zinc-500 flex flex-wrap p-4 m-2 justify-center sticky top-14">
    <AsideFooterLink text="About" />
    <AsideFooterLink text="Accessibility" />
    <AsideFooterLink text="Help Center" />
    <AsideFooterLink
      text="Privacy & Terms"
      subItems={[
        { text: "Privacy Policy", href: "#" },
        { text: "User Agreement", href: "#" },
        { text: "Pages Terms", href: "#" },
        { text: "Cookie Policy", href: "#" },
        { text: "Copyright Policy", href: "#" },
      ]}
    />
    <AsideFooterLink text="Ad Choices" />
    <AsideFooterLink text="Advertising" />
    <AsideFooterLink text="Business Services" />
  </div>
);

export default AsideFooter;