import type { fieldBuilder } from "../builders/field.builder";

export enum FIELD_TYPE {
    FIELD_TEXT = 'text',
    FIELD_LONG_TEXT = 'long_text',
    FIELD_NUMBER = 'number',
    FIELD_RATING = 'rating',
    FIELD_BOOLEAN = 'boolean',
    FIELD_DATE = 'date',
    FIELD_LAST_MODIFIED = 'last_modified',
    FIELD_CREATED_ON = 'created_on',
    FIELD_LINK_ROW = 'link_row',
    FIELD_OPTION_SELECT = 'option_select',
    FIELD_SINGLE_SELECT = 'single_select',
    FIELD_MULTIPLE_SELECT = 'multiple_select',
    FIELD_PHONE_NUMBER = 'phone_number',
    FIELD_FORMULA = 'formula',
    FIELD_COUNT = 'count',
    FIELD_ROLLUP = 'rollup',
    FIELD_LOOKUP = 'lookup',
    FIELD_UUID = 'uuid',
    FIELD_AGGREGATE = 'aggregate'
}

export declare type FIELD = {
    id?: number;
    table_id?: number;
    name: string;
    order?: number;
    type?: FIELD_TYPE;
    primary?: boolean;
    read_only?: boolean;
} & { [key: string]: any }
export declare type FIELD_TEXT = {
    text_default: string
} & FIELD;
export declare type  FIELD_FILE = {} & FIELD;
export declare type FIELD_LONG_TEXT = {
    text_default: string
} & FIELD;
export declare type FIELD_NUMBER = {
    number_decimal_places: number;
    number_negative: boolean;
} & FIELD;
export declare type FIELD_RATING = {
    max_value: number;
    color: string;
    style: string; // enum star, heart - Heart thumbs-up - Thumbs-up flag - Flags smile - Smile
} & FIELD;
export declare type FIELD_BOOLEAN = {} & FIELD;
export declare type FIELD_DATE = {
    date_format: string;
    date_include_time: boolean;
    date_time_format: string;
    date_show_tzinfo: boolean;
    date_force_timezone: boolean;
} & FIELD;

export declare type FIELD_LAST_MOODIFIED = FIELD_DATE;
export declare type FIELD_CREATED_ON = FIELD_DATE;
export declare type FIELD_LINK_ROW = {
    link_row_table_id?: number;
    link_row_related_field_id: number;
    link_row_table?: number;
    link_row_related_field: number;
} & FIELD;
export declare type FIELD_OPTION_SELECT = {
    id?: number;
    value: string;
    color: string;
}
export declare type FIELD_SINGLE_SELECT = {
    select_options?: FIELD_OPTION_SELECT[];
} & FIELD;
export declare type FIELD_MULTIPLE_SELECT = FIELD_SINGLE_SELECT;
export declare type FIELD_PHONE_NUMBER = FIELD;
export declare type FIELD_FORMULA = {
    date_include_time?: boolean;
    date_force_timezone?: boolean;
    date_format?: string;
    date_show_tzinfo?: boolean;
    nullable?: boolean;
    array_formula_type?: string;
    error?: string;
    formula?: string;
    formula_type?: string;
} & FIELD;
export declare type FIELD_COUNT = FIELD_FORMULA;
export declare type FIELD_ROLLUP = {
    through_field_id?: number;
    target_field_id?: number;
    rollup_function?: string
} & FIELD_FORMULA;
export declare type FIELD_LOOKUP = {
    table_id ?: number;
    through_field_id?: number;
    through_field_name?: string;
    target_field_id?: number;
    target_field_name?: string;
} & FIELD_FORMULA;
export declare type FIELD_UUID = FIELD;

export declare type ANY_FIELD = FIELD  & (
    FIELD_TEXT |
    FIELD_UUID |
    FIELD_LOOKUP |
    FIELD_ROLLUP |
    FIELD_COUNT |
    FIELD_FORMULA |
    FIELD_PHONE_NUMBER |
    FIELD_MULTIPLE_SELECT |
    FIELD_SINGLE_SELECT |
    FIELD_TEXT |
    FIELD_NUMBER |
    FIELD_RATING |
    FIELD_BOOLEAN |
    FIELD_DATE |
    FIELD_LAST_MOODIFIED |
    FIELD_DATE |
    FIELD_LINK_ROW
) 

export declare type datafields = {
    infos: ANY_FIELD;
    builder: fieldBuilder;
}