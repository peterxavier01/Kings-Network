import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import React, { Children } from "react";
import { navLinks } from "../data/data";

const ActiveLink = ({ children, activeClassName, ...props }) => {
  const { asPath } = useRouter();
  const child = Children.only(children);
  const childClassName = child.props.className || "";

  const className =
    asPath === props.href || asPath === props.as
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  return (
    <Link {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};

ActiveLink.propTypes = {
  activeClassName: PropTypes.string.isRequired,
};

// // Easier way to create active links
// const router = new Router();
// <ul>
//   {navLinks.map((link) => {
//     <li key={link.title}>
//       <Link href={link.path} passHref>
//         <a className={router.pathname === link.path ? "activeLink" : ""}>
//           {link.title}
//         </a>
//       </Link>
//     </li>;
//   })}
// </ul>;

export default ActiveLink;
