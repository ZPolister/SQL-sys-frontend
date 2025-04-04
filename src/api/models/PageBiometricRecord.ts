/* tslint:disable */
/* eslint-disable */
/**
 * TTXX健康
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
import type { OrderItem } from './OrderItem';
import {
    OrderItemFromJSON,
    OrderItemFromJSONTyped,
    OrderItemToJSON,
    OrderItemToJSONTyped,
} from './OrderItem';
import type { BiometricRecord } from './BiometricRecord';
import {
    BiometricRecordFromJSON,
    BiometricRecordFromJSONTyped,
    BiometricRecordToJSON,
    BiometricRecordToJSONTyped,
} from './BiometricRecord';

/**
 * 响应数据
 * @export
 * @interface PageBiometricRecord
 */
export interface PageBiometricRecord {
    /**
     * 
     * @type {Array<BiometricRecord>}
     * @memberof PageBiometricRecord
     */
    records?: Array<BiometricRecord>;
    /**
     * 
     * @type {number}
     * @memberof PageBiometricRecord
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof PageBiometricRecord
     */
    size?: number;
    /**
     * 
     * @type {number}
     * @memberof PageBiometricRecord
     */
    current?: number;
    /**
     * 
     * @type {Array<OrderItem>}
     * @memberof PageBiometricRecord
     */
    orders?: Array<OrderItem>;
    /**
     * 
     * @type {PageBiometricRecord}
     * @memberof PageBiometricRecord
     */
    optimizeCountSql?: PageBiometricRecord;
    /**
     * 
     * @type {PageBiometricRecord}
     * @memberof PageBiometricRecord
     */
    searchCount?: PageBiometricRecord;
    /**
     * 
     * @type {boolean}
     * @memberof PageBiometricRecord
     */
    optimizeJoinOfCountSql?: boolean;
    /**
     * 
     * @type {number}
     * @memberof PageBiometricRecord
     */
    maxLimit?: number;
    /**
     * 
     * @type {string}
     * @memberof PageBiometricRecord
     */
    countId?: string;
    /**
     * 
     * @type {number}
     * @memberof PageBiometricRecord
     * @deprecated
     */
    pages?: number;
}

/**
 * Check if a given object implements the PageBiometricRecord interface.
 */
export function instanceOfPageBiometricRecord(value: object): value is PageBiometricRecord {
    return true;
}

export function PageBiometricRecordFromJSON(json: any): PageBiometricRecord {
    return PageBiometricRecordFromJSONTyped(json, false);
}

export function PageBiometricRecordFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageBiometricRecord {
    if (json == null) {
        return json;
    }
    return {
        
        'records': json['records'] == null ? undefined : ((json['records'] as Array<any>).map(BiometricRecordFromJSON)),
        'total': json['total'] == null ? undefined : json['total'],
        'size': json['size'] == null ? undefined : json['size'],
        'current': json['current'] == null ? undefined : json['current'],
        'orders': json['orders'] == null ? undefined : ((json['orders'] as Array<any>).map(OrderItemFromJSON)),
        'optimizeCountSql': json['optimizeCountSql'] == null ? undefined : PageBiometricRecordFromJSON(json['optimizeCountSql']),
        'searchCount': json['searchCount'] == null ? undefined : PageBiometricRecordFromJSON(json['searchCount']),
        'optimizeJoinOfCountSql': json['optimizeJoinOfCountSql'] == null ? undefined : json['optimizeJoinOfCountSql'],
        'maxLimit': json['maxLimit'] == null ? undefined : json['maxLimit'],
        'countId': json['countId'] == null ? undefined : json['countId'],
        'pages': json['pages'] == null ? undefined : json['pages'],
    };
}

export function PageBiometricRecordToJSON(json: any): PageBiometricRecord {
    return PageBiometricRecordToJSONTyped(json, false);
}

export function PageBiometricRecordToJSONTyped(value?: PageBiometricRecord | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'records': value['records'] == null ? undefined : ((value['records'] as Array<any>).map(BiometricRecordToJSON)),
        'total': value['total'],
        'size': value['size'],
        'current': value['current'],
        'orders': value['orders'] == null ? undefined : ((value['orders'] as Array<any>).map(OrderItemToJSON)),
        'optimizeCountSql': PageBiometricRecordToJSON(value['optimizeCountSql']),
        'searchCount': PageBiometricRecordToJSON(value['searchCount']),
        'optimizeJoinOfCountSql': value['optimizeJoinOfCountSql'],
        'maxLimit': value['maxLimit'],
        'countId': value['countId'],
        'pages': value['pages'],
    };
}

