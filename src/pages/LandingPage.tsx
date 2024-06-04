import Footer from "@/components/LandingPage/Footer";
import HeroScetion from "@/components/LandingPage/HeroScetion";
import Navbar from "@/components/LandingPage/Navbar";
import SectionOne from "@/components/LandingPage/SectionOne";
import SectionTwo from "@/components/LandingPage/SectionTwo";
import Card from "@/components/LandingPage/Card";

export default function LandingPage() {
    const cardData = [
        {
            id: 1,
            title: "KPI management",
            text:
                "The KPI functionalities in 'Exop' allow administrators to create, manage, and track key performance indicators, while enabling users to view their progress and contribute to achieving organizational targets through assigned tasks.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-target"
                >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                </svg>
            ),
            iconBg: "bg-blue-500",
        },
        {
            id: 2,
            title: "Task management",
            text:
                "The task management functionalities in 'Exop' enable administrators to create, assign, and monitor tasks, while allowing users to update their task statuses and administrators to verify completed tasks for effective project tracking and performance improvement.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clipboard-check"
                >
                    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                    <path d="m9 14 2 2 4-4" />
                </svg>
            ),
            iconBg: "bg-green-500",
        },
        {
            id: 3,
            title: "Employees management",
            text:
                "The employee management functionalities in 'Exop' enable administrators to create, modify, and delete employee profiles, assign roles and permissions, while allowing employees to view the list of users and their own profile details.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-users-round"
                >
                    <path d="M18 21a8 8 0 0 0-16 0" />
                    <circle cx="10" cy="8" r="5" />
                    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                </svg>
            ),
            iconBg: "bg-red-500",
        },
        {
            id: 4,
            title: "School newspaper",
            text:
                "The newspaper functionality in 'Exop' allows administrators to publish, edit, and delete news and updates, while enabling all users to view the latest news and stay informed about important announcements and events within the organization.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-users-round"
                >
                    <path d="M18 21a8 8 0 0 0-16 0" />
                    <circle cx="10" cy="8" r="5" />
                    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                </svg>
            ),
            iconBg: "bg-yellow-500",
        },
        {
            id: 5,
            title: "Meeting management",
            text:
                "The meeting management functionalities in 'Exop' enable administrators to schedule, modify, and document meetings, while allowing users to view upcoming meeting details and download meeting summaries for efficient communication and collaboration within the organization.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-presentation"
                >
                    <path d="M2 3h20" />
                    <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                    <path d="m7 21 5-5 5 5" />
                </svg>
            ),
            iconBg: "bg-purple-500",
        },
        {
            id: 6,
            title: "Dashboard",
            text:
                "The dashboard functionality in 'Exop' provides users with a comprehensive overview of key performance metrics and organizational insights, facilitating data-driven decision-making and performance monitoring for administrators and users alike.",
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-dashboard"
                >
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
            ),
            iconBg: "bg-pink-500",
        },
    ];
    return (
        <>
            <div className="bg-white">
                <Navbar />
                <HeroScetion />
                <div id='whyExop'>
                    <SectionOne />
                </div>
                <div id='howItWorks'>
                    <SectionTwo />
                </div>
                <section id='features' className="py-12">
                    <div className="mx-auto px-4">
                        <h2 className="text-3xl font-semibold text-center mb-8">
                            Explore Comprehensive Features
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cardData.map(({ id, title, text, icon, iconBg }) => (
                                <Card
                                    key={id}
                                    title={title}
                                    text={text}
                                    icon={icon}
                                    iconBg={iconBg}
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </>
    );
}
