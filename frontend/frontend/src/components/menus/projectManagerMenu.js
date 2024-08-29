

const projectManagerMenu = [
    { name: 'Control Center', link: '/project-manager/dashboard', icon: 'bi-house-door' },
    {
        name: 'Project Hub',
        link: '#',
        icon: 'bi-house-gear',
        subMenu: [
            { name: 'Project Overview', link: '/project-manager/projects/overview' },
            { name: 'Project Status', link: '/project-manager/projects/status' },
            { name: 'Project Reports', link: '/project-manager/projects/reports' }
        ]
    },
    { name: 'Daily Pulse', link: '#', icon: 'bi bi-bricks' },
    { name: 'Vendor Vault', link: '#', icon: 'bi bi-file-earmark-person-fill' },
    { name: 'Inspection', link: '#', icon: 'bi bi-table' },
    { name: 'Settings', link: '#', icon: 'bi bi-tools' },
];

export default projectManagerMenu;
