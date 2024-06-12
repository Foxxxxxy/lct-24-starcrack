import {Table, TableColumnConfig} from '@gravity-ui/uikit';
import {FC} from 'react';

interface PresetTableData {
    presetId: string;
    cpuLimit: string;
    cpuFraction: string;
    memoryLimit: string;
}

const presetTableColumns = [
    {
        id: 'presetId',
        name: "i18nK('section_resource')",
    },
    {
        id: 'cpuLimit',
        name: "i18nK('label_cpu_limit')",
    },
    {
        id: 'cpuFraction',
        name: "i18nK('label_core-fraction')",
    },
    {
        id: 'memoryLimit',
        name: "i18nK('label_memory_limit')",
    },
] as TableColumnConfig<PresetTableData>[];

export const MainPage: FC = () => {
    const result = {
        presetId: '123',
        cpuLimit: "i18nK('field_cpu_limit_value', {count: Number(preset.cpuLimit)})",
        cpuFraction: 'asdadsad',
        memoryLimit: "i18nK('field_memory_limit_value', {count: memory})",
    } as PresetTableData;

    return <Table columns={presetTableColumns} data={[result]} onRowClick={() => {}} />;
};
