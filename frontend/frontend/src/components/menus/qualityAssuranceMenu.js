const qualityAssuranceMenu = [
    { name: 'Inspection Hub', link: '#', icon: 'bi bi-search-heart' },
    { name: 'Schedule Overview', link: '#submenu', icon: 'bi bi-stack-overflow' },
    {
        name: 'Plotting Plan',
        link: '#',
        icon: 'bi bi-journal-medical',
        subMenu: [
            { name: 'Archive Overview', link: '/qa/plotting-plan/archive-overview' },
            { name: 'Archived Plans', link: '/qa/plotting-plan/archived-plans' },
            { name: 'Plan Retrieval', link: '/qa/plotting-plan/plan-retrieval' }
        ]
    },
    { name: 'Inspection Reports', link: '#', icon: 'bi bi-clipboard2-pulse' },
    { name: 'Inquiry Hub', link: '#', icon: 'bi bi-envelope-paper-fill' },
    { name: 'Maintenance Hub', link: '#', icon: 'bi bi-cone-striped' },
];

export default qualityAssuranceMenu;
