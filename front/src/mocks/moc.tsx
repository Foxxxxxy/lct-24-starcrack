import {Gear, Plus} from '@gravity-ui/icons';
import {MenuItem} from '@gravity-ui/navigation';
import {AsideHeaderContextType} from '@gravity-ui/navigation/build/esm/components/AsideHeader/AsideHeaderContext';

function renderTag(tag: string) {
    return <div className="composite-bar-showcase__tag">{tag.toUpperCase()}</div>;
}

export const ASIDE_HEADER_EXPANDED_WIDTH = 236;

export const EMPTY_CONTEXT_VALUE: AsideHeaderContextType = {
    size: ASIDE_HEADER_EXPANDED_WIDTH,
    compact: true,
};

export const menuItemsShowcase: MenuItem[] = [
    {
        id: 'overview',
        title: 'Overview',
        icon: Gear,
        qa: 'menu-item-gear',
        iconQa: 'menu-item-icon-gear',
    },
    {
        id: 'operations',
        title: 'Operations',
        icon: Gear,
        rightAdornment: renderTag('New'),
    },
    {
        id: 'templates',
        title: 'Main notifications long menu title',
        icon: Gear,
    },
    {
        id: 'divider',
        title: '-',
        type: 'divider',
    },
    {
        id: 'notifications',
        title: 'Main notifications long long long long menu title',
        icon: Gear,
        current: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        icon: Gear,
        rightAdornment: renderTag('New'),
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
    {
        id: 'divider2',
        title: '-',
        type: 'divider',
    },
    {
        id: 'id1',
        title: 'Objects',
        tooltipText: 'Custom tooltip text',
        icon: Gear,
        pinned: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
        itemWrapper(params, makeItem, {collapsed, compact}) {
            return !collapsed && !compact ? (
                <div className="composite-bar-showcase__item-accent aside-header-showcase__item-accent">
                    {makeItem(params)}
                </div>
            ) : (
                makeItem(params)
            );
        },
    },
    {
        id: 'action2',
        title: 'Create smth',
        type: 'action',
        icon: Plus,
        afterMoreButton: true,
        onItemClick({id, title, current}) {
            alert(JSON.stringify({id, title, current}));
        },
    },
];
