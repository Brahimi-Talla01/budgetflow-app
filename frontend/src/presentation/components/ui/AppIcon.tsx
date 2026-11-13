// import * as LucideIcons from 'lucide-react';
// import { HelpCircle } from 'lucide-react';


// type LucideIconNames = keyof typeof LucideIcons;

// interface AppIconProps {
//       name: LucideIconNames;
//       size?: number | string;
//       color?: string;
//       className?: string;
//       strokeWidth?: number;
// }

// export default function Icon({
//       name,
//       size = 24,
//       color = 'currentColor',
//       className = '',
//       strokeWidth = 2,
//       ...props
// }: AppIconProps) {
//       const IconComponent = LucideIcons?.[name];

//       if (!IconComponent) {
//             console.warn(`AppIcon: icône "${name}" introuvable. Affichage de HelpCircle à la place.`);
//             return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
//       }

//       return (
//             <Icon
//                   name={name}
//                   size={size}
//                   color={color}
//                   strokeWidth={strokeWidth}
//                   className={className}
//                   {...props}
//             />
//       );
// }
