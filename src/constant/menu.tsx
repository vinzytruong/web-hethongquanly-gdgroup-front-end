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
                title: "Home",
                type: 'item',
                url: '/home',
                icon: <IconHome />,
                breadcrumbs: false
            },
            {
                id: 'administrative_personnel',
                title: "Administrative personnel",
                type: 'collapse',
                url: '/administrative-personnel',
                icon: <IconCheese />,
                breadcrumbs: false,
                children:[
                    {
                        id: 'staff-information',
                        title: "Staff information",
                        type: 'item',
                        url: '/administrative-personnel/staff',
                        icon: <IconHome />,
                        breadcrumbs: false
                    },
                    {
                        id: 'time-keeping',
                        title: "Timekeeping",
                        type: 'item',
                        url: '/administrative-personnel/checking',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'Leave-of-absence',
                        title: "Leave of absence",
                        type: 'item',
                        url: '/administrative-personnel/be-on-leave',
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
                type: 'collapse',
                url: '#',
                icon: <IconMapPin />,
                breadcrumbs: false,
                children:[
                    {
                        id: 'task',
                        title: "Công việc",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'schedule',
                        title: "Lịch trình",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'report-task',
                        title: "Báo cáo công việc",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                ]
            },
            {
                id: 'product',
                title: "Quản lý sản phẩm",
                type: 'collapse',
                url: '#',
                icon: <IconMapPin />,
                breadcrumbs: false,
                children:[
                    {
                        id: 'product-by',
                        title: "Sản phẩm theo thông tư",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'estimate',
                        title: "Dự toán",
                        type: 'item',
                        url: '#',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                ]
            },
            {
                id: 'customer',
                title: "Quản lý khách hàng",
                type: 'collapse',
                url: '/customer',
                icon: <IconMapPin />,
                breadcrumbs: false,
                children:[
                    {
                        id: 'budget',
                        title: "Ngân sách",
                        type: 'item',
                        url: '/customer/budget',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'interactive_history',
                        title: "Quản lý tương tác",
                        type: 'item',
                        url: '/customer/interaction',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'contractors',
                        title: "Nhà thầu",
                        type: 'item',
                        url: '/customer/contractors',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'supplier',
                        title: "Nhà cung cấp",
                        type: 'item',
                        url: '/customer/supplier',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    {
                        id: 'author',
                        title: "Tác giả",
                        type: 'item',
                        url: '/customer/author',
                        icon: <IconCheese />,
                        breadcrumbs: false
                    },
                    
                ]
            },
            {
                id: 'warehouse',
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
