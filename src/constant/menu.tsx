import { NavItemType } from '@/components/slidebar/menu-list/nav-item';
import { IconDeviceAnalytics, IconHome, IconCheese, IconMapPin } from '@tabler/icons-react';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboardAdmin = [
    {
        id: 'dashboard-admin',
        title: `Version 1.0.0`,
        type: 'group',
        children: [
            {
                id: 'home',
                title: "Trang chủ",
                type: 'item',
                url: '/home',
                icon: <IconHome />,
                breadcrumbs: false
            },
            {
                id: 'employee',
                title: "Hành chính nhân sự",
                type: 'collapse',
                url: '#',
                icon: <IconCheese />,
                breadcrumbs: false,
                children:[
                    {
                        id: 'home',
                        title: "Thông tin nhân sự",
                        type: 'item',
                        url: '#',
                        icon: <IconHome />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Chấm công",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Nghỉ phép",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Văn bản",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Định vị",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Tài sản",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Tuyển dụng",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Đào tạo",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Thu chi",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                ]
            },
            {
                id: 'work',
                title: "Quản lý công việc",
                type: 'item',
                url: '#',
                icon: <IconMapPin />,
                breadcrumbs: false
            },
            {
                id: 'product',
                title: "Quản lý sản phẩm",
                type: 'item',
                url: '#',
                icon: <IconMapPin />,
                breadcrumbs: false
            },
            {
                id: 'customer',
                title: "Quản lý khách hàng",
                type: 'item',
                url: '#',
                icon: <IconMapPin />,
                breadcrumbs: false
            },
            {
                id: 'customer',
                title: "Quản lý kho",
                type: 'item',
                url: '#',
                icon: <IconMapPin />,
                breadcrumbs: false
            }
            // {
            //     id: 'admin-sites',
            //     title: "Địa điểm",
            //     type: 'collapse',
            //     url: '/admin/sites',
            //     icon: <IconDeviceAnalytics/>,
            //     breadcrumbs: false,
            //     children: [
            //         {
            //             id: 'admin-product-one',
            //             title: "Di tích lịch sử",
            //             type: 'item',
            //             url: '/admin/sites/historical',
            //             icon: <IconEyeTable/>,
            //             breadcrumbs: false
            //         },
            //         {
            //             id: 'admin-product-two',
            //             title: "Địa điểm du lịch",
            //             type: 'item',
            //             url: '/admin/sites/sightseeing',
            //             icon: <IconDevices/>,
            //             breadcrumbs: false
            //         },  
            //     ]
            // },

        ]
    },
]

const menuItems: { items: NavItemType[] } = {
    items: dashboardAdmin
};

export default menuItems;
