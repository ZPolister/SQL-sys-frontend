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

/**
 * 登录请求参数
 * @export
 * @interface LoginDto
 */
export interface LoginDto {
    /**
     * 登录标识（用户名或邮箱）
     * @type {string}
     * @memberof LoginDto
     */
    identifier: string;
    /**
     * 登录密码
     * @type {string}
     * @memberof LoginDto
     */
    password: string;
}

/**
 * Check if a given object implements the LoginDto interface.
 */
export function instanceOfLoginDto(value: object): value is LoginDto {
    if (!('identifier' in value) || value['identifier'] === undefined) return false;
    if (!('password' in value) || value['password'] === undefined) return false;
    return true;
}

export function LoginDtoFromJSON(json: any): LoginDto {
    return LoginDtoFromJSONTyped(json, false);
}

export function LoginDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): LoginDto {
    if (json == null) {
        return json;
    }
    return {

        'identifier': json['identifier'],
        'password': json['password'],
    };
}

export function LoginDtoToJSON(json: any): LoginDto {
    return LoginDtoToJSONTyped(json, false);
}

export function LoginDtoToJSONTyped(value?: LoginDto | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {

        'identifier': value['identifier'],
        'password': value['password'],
    };
}

