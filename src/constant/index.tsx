import { ContactInfo } from "@/interfaces/contact";
import { Navigation, NavigationHasChildren } from "@/interfaces/navigation";
import { SocialLink } from "@/interfaces/social-link";



// Theme constant
export const gridSpacing = 3;
export const drawerWidth = 300;
export const appDrawerWidth = 320;
export const headerHeight = 78
export const BRAND_NAME = 'GDGroup'
export const BRAND_IMAGE = 'Template nextjs material-ui'

export const META_DATA = {
    title:'Hệ thống quản lý GDGroup',
    image:'/favicon/logo-gd-group-300x300.png',
    icon:'/favicon/logo-gd-group-300x300.png',
    description:'Hệ thông quản lý Hệ thống sinh thái giáo dục GDGroup',
    url:''
}

// Footer constant
export const socialLinks: SocialLink[] = [
    {
        name: 'Instagram',
        link: '',
        icon: '/images/icons/instagram.svg',
    },
    {
        name: 'YouTube',
        link: '',
        icon: '/images/icons/youtube.svg',
    },
    {
        name: 'Twitter',
        link: '',
        icon: '/images/icons/twitter.svg',
    },
    {
        name: 'Dribbble',
        link: '',
        icon: '/images/icons/dribbble.svg',
    },
]

// Contact infomation
export const contactInfo: ContactInfo = {
    address: 'Khóm 5, thị trấn Cầu Kè, Huyện Cầu Kè, Trà Vinh',
    phone: '0294.3834.077',
    email: 'huyendoancauketv@gmail.com',
}

// Footer navigation
export const navigationLink: Array<Navigation> = [
    {
        label: 'UBND Huyện Cầu Kè',
        path: 'https://cauke.travinh.gov.vn',
    },
    {
        label: 'Tuổi trẻ huyện Cầu Kè',
        path: 'https://cauke.tinhdoantravinh.vn',
    },
    {
        label: 'Facebook Huyện đoàn Cầu Kè',
        path: 'https://www.facebook.com/profile.php?id=100014766810397',
    },
]

// Menu header
export const navigationMenu: NavigationHasChildren[] = [
    {
        label: 'Trang chủ',
        path: '/',
        children: null
    },
    {
        label: 'Hoạt động du lịch',
        path: 'activity',
        children: null
    },
    {
        label: 'Địa điểm',
        path: '',
        children: [
            {
                label: 'Địa điểm du lịch',
                path: 'sightseeing',
            },
            {
                label: 'Di tích lịch sử',
                path: 'historical'
            },
            {
                label: 'Sản phẩm COOP',
                path: 'product'
            }
        ]
    }
]