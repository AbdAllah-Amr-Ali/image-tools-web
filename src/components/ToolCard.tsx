import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ToolCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    href: string;
    color: string;
}

export default function ToolCard({ title, description, icon: Icon, href, color }: ToolCardProps) {
    return (
        <Link href={href} className="block h-full">
            <motion.div
                whileHover={{ y: -4 }}
                className="bg-card border border-border rounded-xl p-6 h-full shadow-sm hover:shadow-md transition-all duration-200 group"
            >
                <div className="flex flex-col h-full">
                    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4 text-white`}>
                        <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </h3>

                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {description}
                    </p>
                </div>
            </motion.div>
        </Link>
    );
}
