import { ChartIcon, MagnifierIcon, WalletIcon } from "@/components/icons";
import { DrawingPinIcon, LightningBoltIcon, PersonIcon, RocketIcon, RulerSquareIcon, Share1Icon } from "@radix-ui/react-icons";
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

export const socialMediaLinks = [
  {
    id: 1,
    name: 'facebook',
    url: 'https://www.facebook.com/profile.php?id=100093809678820',
    icon: FaFacebookF,
  },
  {
    id: 2,
    name: 'twitter',
    url: 'https://twitter.com/i/lists/1666911876943421440',
    icon: FaXTwitter,
  },
  {
    id: 3,
    name: 'linkedin',
    url: 'https://www.linkedin.com/company/alefteam/about',
    icon: FaLinkedinIn,
  },
]

export const navLinks = [
  {
    href: "#about",
    label: "About",
  },
  {
    href: "#services",
    label: "Services",
  },
  {
    href: "#events",
    label: "Events",
  },
  {
    href: "#funding",
    label: "Funding",
  },
  {
    href: "#business",
    label: "Business",
  },
  {
    href: "#jobs",
    label: "Jobs",
  },

  {
    href: "#groups",
    label: "Groups",
  },
];

export const services = [
  {
    id: 1,
    title: "Advertise Your Business",
    description:
      "Promote your business to the Business School Alumns community.",
    icon: Share1Icon,
  },
  {
    id: 2,
    title: "Post a Job Offer",
    description:
      "Hire talented individuals from the Business School Alumns network.",
    icon: RulerSquareIcon,
  },
  {
    id: 3,
    title: "Look for Work",
    description:
      "Explore job opportunities posted by fellow Business School Alumns.",
    icon: LightningBoltIcon,
  },
  {
    id: 4,
    title: "Offer Funding",
    description: "Provide financial support for projects or initiatives.",
    icon: DrawingPinIcon,
  },
  {
    id: 5,
    title: "Raise Funding",
    description: "Seek funding for your projects or ventures.",
    icon: RocketIcon,
  },
  {
    id: 6,
    title: "Organise Meetings",
    description: "Plan and coordinate meetings or events with ease.",
    icon: PersonIcon,
  },
];

export const events = [
  {
    id: 1,
    title: "Startup Pitch Night",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-06-15T19:00:00Z",
    location: "Main Hall, University Campus",
    zoom_link: null,
    type: "inPerson",
    image: "https://example.com/images/startup-pitch-night.jpg"
  },
  {
    id: 2,
    title: "Remote Coding Bootcamp",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-06-20T14:00:00Z",
    location: "Online",
    zoom_link: "https://zoom.us/j/1234567890",
    type: "remote",
    image: "https://example.com/images/remote-coding-bootcamp.jpg"
  },
  {
    id: 3,
    title: "Alumni Networking Event",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-07-05T18:00:00Z",
    location: "City Conference Center",
    zoom_link: null,
    type: "inPerson",
    image: "https://example.com/images/alumni-networking-event.jpg"
  },
  {
    id: 4,
    title: "Virtual Career Fair",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-07-10T10:00:00Z",
    location: "Online",
    zoom_link: "https://zoom.us/j/0987654321",
    type: "remote",
    image: "https://example.com/images/virtual-career-fair.jpg"
  },
  {
    id: 5,
    title: "Entrepreneurship Workshop",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-07-15T09:00:00Z",
    location: "Innovation Lab, University Campus",
    zoom_link: null,
    type: "inPerson",
    image: "https://example.com/images/entrepreneurship-workshop.jpg"
  },
  {
    id: 6,
    title: "Remote Marketing Seminar",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-08-01T16:00:00Z",
    location: "Online",
    zoom_link: "https://zoom.us/j/1122334455",
    type: "remote",
    image: "https://example.com/images/remote-marketing-seminar.jpg"
  },
  {
    id: 7,
    title: "Tech Conference 2024",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-08-15T09:00:00Z",
    location: "Grand Auditorium, City Center",
    zoom_link: null,
    type: "inPerson",
    image: "https://example.com/images/tech-conference-2024.jpg"
  },
  {
    id: 8,
    title: "Remote Leadership Webinar",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-08-25T11:00:00Z",
    location: "Online",
    zoom_link: "https://zoom.us/j/2233445566",
    type: "remote",
    image: "https://example.com/images/remote-leadership-webinar.jpg"
  },
  {
    id: 9,
    title: "Graduate Mixer",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-09-10T18:00:00Z",
    location: "Alumni Hall, University Campus",
    zoom_link: null,
    type: "inPerson",
    image: "https://example.com/images/graduate-mixer.jpg"
  },
  {
    id: 10,
    title: "Virtual Product Design Workshop",
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna',
    date: "2024-09-15T13:00:00Z",
    location: "Online",
    zoom_link: "https://zoom.us/j/3344556677",
    type: "remote",
    image: "https://example.com/images/virtual-product-design-workshop.jpg"
  }
];

export const fundingServices = [
  {
    title: "Seed Funding",
    description:
      "Get initial capital to kickstart your innovative projects and ideas.",
    icon: ChartIcon,
  },
  {
    title: "Venture Capital",
    description:
      "Access significant investment to scale your business and reach new heights.",
    icon: WalletIcon,
  },
  {
    title: "Grants and Scholarships",
    description:
      "Apply for grants and scholarships to support your business without repayment obligations.",
    icon: MagnifierIcon,
  },
];