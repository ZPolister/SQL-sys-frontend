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
import type { ExerciseLog } from './ExerciseLog';
import {
    ExerciseLogFromJSON,
    ExerciseLogFromJSONTyped,
    ExerciseLogToJSON,
    ExerciseLogToJSONTyped,
} from './ExerciseLog';

/**
 * 响应数据
 * @export
 * @interface PageExerciseLog
 */
export interface PageExerciseLog {
    /**
     * 
     * @type {Array<ExerciseLog>}
     * @memberof PageExerciseLog
     */
    records?: Array<ExerciseLog>;
    /**
     * 
     * @type {number}
     * @memberof PageExerciseLog
     */
    total?: number;
    /**
     * 
     * @type {number}
     * @memberof PageExerciseLog
     */
    size?: number;
    /**
     * 
     * @type {number}
     * @memberof PageExerciseLog
     */
    current?: number;
    /**
     * 
     * @type {Array<OrderItem>}
     * @memberof PageExerciseLog
     */
    orders?: Array<OrderItem>;
    /**
     * 
     * @type {PageExerciseLog}
     * @memberof PageExerciseLog
     */
    optimizeCountSql?: PageExerciseLog;
    /**
     * 
     * @type {PageExerciseLog}
     * @memberof PageExerciseLog
     */
    searchCount?: PageExerciseLog;
    /**
     * 
     * @type {boolean}
     * @memberof PageExerciseLog
     */
    optimizeJoinOfCountSql?: boolean;
    /**
     * 
     * @type {number}
     * @memberof PageExerciseLog
     */
    maxLimit?: number;
    /**
     * 
     * @type {string}
     * @memberof PageExerciseLog
     */
    countId?: string;
    /**
     * 
     * @type {number}
     * @memberof PageExerciseLog
     * @deprecated
     */
    pages?: number;
}

/**
 * Check if a given object implements the PageExerciseLog interface.
 */
export function instanceOfPageExerciseLog(value: object): value is PageExerciseLog {
    return true;
}

export function PageExerciseLogFromJSON(json: any): PageExerciseLog {
    return PageExerciseLogFromJSONTyped(json, false);
}

export function PageExerciseLogFromJSONTyped(json: any, ignoreDiscriminator: boolean): PageExerciseLog {
    if (json == null) {
        return json;
    }
    return {
        
        'records': json['records'] == null ? undefined : ((json['records'] as Array<any>).map(ExerciseLogFromJSON)),
        'total': json['total'] == null ? undefined : json['total'],
        'size': json['size'] == null ? undefined : json['size'],
        'current': json['current'] == null ? undefined : json['current'],
        'orders': json['orders'] == null ? undefined : ((json['orders'] as Array<any>).map(OrderItemFromJSON)),
        'optimizeCountSql': json['optimizeCountSql'] == null ? undefined : PageExerciseLogFromJSON(json['optimizeCountSql']),
        'searchCount': json['searchCount'] == null ? undefined : PageExerciseLogFromJSON(json['searchCount']),
        'optimizeJoinOfCountSql': json['optimizeJoinOfCountSql'] == null ? undefined : json['optimizeJoinOfCountSql'],
        'maxLimit': json['maxLimit'] == null ? undefined : json['maxLimit'],
        'countId': json['countId'] == null ? undefined : json['countId'],
        'pages': json['pages'] == null ? undefined : json['pages'],
    };
}

export function PageExerciseLogToJSON(json: any): PageExerciseLog {
    return PageExerciseLogToJSONTyped(json, false);
}

export function PageExerciseLogToJSONTyped(value?: PageExerciseLog | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'records': value['records'] == null ? undefined : ((value['records'] as Array<any>).map(ExerciseLogToJSON)),
        'total': value['total'],
        'size': value['size'],
        'current': value['current'],
        'orders': value['orders'] == null ? undefined : ((value['orders'] as Array<any>).map(OrderItemToJSON)),
        'optimizeCountSql': PageExerciseLogToJSON(value['optimizeCountSql']),
        'searchCount': PageExerciseLogToJSON(value['searchCount']),
        'optimizeJoinOfCountSql': value['optimizeJoinOfCountSql'],
        'maxLimit': value['maxLimit'],
        'countId': value['countId'],
        'pages': value['pages'],
    };
}

