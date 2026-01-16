import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollUpButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const windowHeight = window.innerHeight;

            // Show when scrolled more than half of page
            if (scrollTop > scrollHeight / 2 - windowHeight) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
        >
            <button
                onClick={scrollToTop}
                className="btn btn-primary btn-circle shadow-lg hover:scale-110 transition"
                aria-label="Scroll to top"
            >
                <ArrowUp size={20} />
            </button>
        </div>
    );
};

export default ScrollUpButton;
