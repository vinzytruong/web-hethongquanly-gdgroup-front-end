import { NavItemType } from '@/components/slidebar/menu-list/nav-item';
import { IconSettings2, IconRosetteNumber0, IconDeviceAnalytics, IconHome, IconCheese, IconMapPin, IconSmartHome, IconUsersGroup, IconUserStar, IconWebhook, IconHomeCheck, IconHomeX, IconTextSize, IconCoins, IconBrandApplePodcast, IconSchool, IconCoin, IconListCheck, IconChecklist, IconListNumbers, IconReport, IconCalendarPlus, IconPlant, IconCheckbox, IconBuildingStore, IconShieldCheck, IconAtom2, IconCategoryPlus, IconBrandCodesandbox, IconCalculator, IconBuildingCommunity, IconUsers, IconBrandSuperhuman, IconHighlight, IconAdjustmentsStar, IconPresentation, IconDeviceProjector, IconPropeller, IconAerialLift, IconBuildingWarehouse, IconBuildingCottage } from '@tabler/icons-react';
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
                icon: <IconSmartHome stroke={1.5} />,
                breadcrumbs: false
            },
            {
                id: 'administrative_personnel',
                title: "Hành chính nhân sự",
                type: 'collapse',
                url: '/administrative-personnel',
                icon: <IconUsersGroup stroke={1.5} />,
                breadcrumbs: false,
                children: [
                    {
                        id: 'staff-information',
                        title: "Nhân viên",
                        type: 'item',
                        url: '/administrative-personnel/staff',
                        icon: <IconUserStar stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'company',
                        title: "Công ty",
                        type: 'item',
                        url: '/administrative-personnel/company',
                        icon: <IconWebhook stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'time-keeping',
                        title: "Chấm công",
                        type: 'item',
                        url: '/administrative-personnel/checking',
                        icon: <IconHomeCheck stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'Leave-of-absence',
                        title: "Nghỉ phép",
                        type: 'item',
                        url: '/administrative-personnel/be-on-leave',
                        icon: <IconHomeX stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Văn bản",
                        type: 'item',
                        url: '#',
                        icon: <IconTextSize stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Định vị",
                        type: 'item',
                        url: '#',
                        icon: <IconMapPin stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'money',
                        title: "Tài sản",
                        type: 'item',
                        url: '#',
                        icon: <IconCoins stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'apply',
                        title: "Tuyển dụng",
                        type: 'item',
                        url: '#',
                        icon: <IconBrandApplePodcast stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'training',
                        title: "Đào tạo",
                        type: 'item',
                        url: '#',
                        icon: <IconSchool stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'employee',
                        title: "Thu chi",
                        type: 'item',
                        url: '#',
                        icon: <IconCoin stroke={1.5} />,
                        breadcrumbs: false
                    },
                ]
            },
            {
                id: 'plan',
                title: "Quản lý công việc",
                type: 'collapse',
                url: '#',
                icon: <IconCalendarPlus stroke={1.5} />,
                breadcrumbs: false,
                children: [
                    {
                        id: 'create_assign',
                        title: "Giao việc",
                        type: 'item',
                        url: '/workflow/assign',
                        icon: <IconPlant stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'assginedWork',
                        title: "Công việc được giao",
                        type: 'item',
                        url: '/workflow/assigned-work',
                        icon: <IconPlant stroke={1.5} />,
                        breadcrumbs: false
                    },
                ]
            },
            {
                id: 'plan',
                title: "Quản lý kế hoạch",
                type: 'collapse',
                url: '#',
                icon: <IconCalendarPlus stroke={1.5} />,
                breadcrumbs: false,
                children: [
                    {
                        id: 'create_plan',
                        title: "Lập kế hoạch",
                        type: 'item',
                        url: '/plan/create',
                        icon: <IconPlant stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'confirm_plan',
                        title: "Duyệt kế hoạch",
                        type: 'item',
                        url: '/plan/confirm',
                        icon: <IconCheckbox stroke={1.5} />,
                        breadcrumbs: false
                    },
                ]
            },
            {
                id: 'product',
                title: "Quản lý sản phẩm",
                type: 'collapse',
                url: '/product',
                icon: <IconBuildingStore stroke={1.5} />,
                breadcrumbs: false,
                children: [
                    {
                        id: 'product-by',
                        title: "Sản phẩm theo thông tư",
                        type: 'item',
                        url: '/product/product-by',
                        icon: <IconShieldCheck stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'unit',
                        title: "Đơn vị tính",
                        type: 'item',
                        url: '/product/unit',
                        icon: <IconAtom2 stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'category',
                        title: "Danh mục",
                        type: 'item',
                        url: '/product/category',
                        icon: <IconCategoryPlus stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'productType',
                        title: "Loại sản phẩm",
                        type: 'item',
                        url: '/product/product-type',
                        icon: <IconBrandCodesandbox stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'estimate',
                        title: "Xây dự toán",
                        type: 'item',
                        url: '/product/estimate',
                        icon: <IconCalculator stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'company_estimate',
                        title: "Công ty",
                        type: 'item',
                        url: '/product/company-estimate',
                        icon: <IconBuildingCommunity stroke={1.5} />,
                        breadcrumbs: false
                    },

                ]
            },
            {
                id: 'partner',
                title: "Quản lý đối tác",
                type: 'collapse',
                url: '/partner',
                icon: <IconUsers stroke={1.5} />,
                breadcrumbs: false,
                children: [
                    {
                        id: 'supplier',
                        title: "Nhà cung cấp",
                        type: 'item',
                        url: '/partner/supplier',
                        icon: <IconBrandSuperhuman stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'author',
                        title: "Tác giả",
                        type: 'item',
                        url: '/partner/author',
                        icon: <IconHighlight stroke={1.5} />,
                        breadcrumbs: false
                    },

                ]
            },
            {
                id: 'customer',
                title: "Quản lý khách hàng",
                type: 'collapse',
                url: '/customer',
                icon: <IconAdjustmentsStar stroke={1.5} />,
                breadcrumbs: false,
                children: [
                    {
                        id: 'project',
                        title: "Dự án",
                        type: 'item',
                        url: '/customer/project',
                        icon: <IconPresentation stroke={1.5} />,
                        breadcrumbs: false
                    },

                    {
                        id: 'contractors',
                        title: "Nhà thầu",
                        type: 'item',
                        url: '/customer/contractors',
                        icon: <IconDeviceProjector stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'agency',
                        title: "Đại lý",
                        type: 'item',
                        url: '/customer/agency',
                        icon: <IconPropeller stroke={1.5} />,
                        breadcrumbs: false
                    },



                ]
            },
            {
                id: 'config',
                title: "Cài đặt",
                type: 'collapse',
                url: '/config',
                icon: <IconAdjustmentsStar stroke={1.5} />,
                breadcrumbs: false,
                children: [
                    {
                        id: 'configNotification',
                        title: "Cấu hình thông báo",
                        type: 'item',
                        url: '/config/notification',
                        icon: <IconSettings2 stroke={1.5} />,
                        breadcrumbs: false
                    },
                    {
                        id: 'setcode',
                        title: "Set code telegram",
                        type: 'item',
                        url: '/config/set-code',
                        icon: <IconRosetteNumber0 stroke={1.5} />,
                        breadcrumbs: false
                    },
                ]
            },
            // {
            //     id: 'estimate_manage',
            //     title: "Quản lý dự toán",
            //     type: 'item',
            //     url: '#',
            //     icon: <IconAerialLift stroke={1.5} />,
            //     breadcrumbs: false
            // },
            // {
            //     id: 'warehouse',
            //     title: "Quản lý kho",
            //     type: 'item',
            //     url: '#',
            //     icon: <IconBuildingCottage stroke={1.5} />,
            //     breadcrumbs: false
            // }


        ]
    },
]

const menuItems: { items: NavItemType[] } = {
    items: dashboardAdmin
};

export default menuItems;
