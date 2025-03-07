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


import * as runtime from '../runtime';
import type {
    BiometricRecordDto,
    DietLogDto,
    ExerciseLogDto,
    GetApiAuthCheckLogin200Response,
    HealthGoalDto,
    LoginDto,
    Page,
    RegisterDto,
    ResponseResult,
    SleepLogDto,
} from '../models/index';
import {
    BiometricRecordDtoToJSON,
    DietLogDtoToJSON,
    ExerciseLogDtoToJSON,
    GetApiAuthCheckLogin200ResponseFromJSON,
    HealthGoalDtoToJSON,
    LoginDtoToJSON,
    PageFromJSON,
    RegisterDtoToJSON,
    ResponseResultFromJSON,
    SleepLogDtoToJSON,
} from '../models/index';

export interface DeleteApiHealthBiometricIdRequest {
    id: number;
}

export interface DeleteDietLogIdRequest {
    logId: number;
}

export interface DeleteExerciseLogIdRequest {
    logId: number;
}

export interface DeleteHealthGoalsGoalIdRequest {
    goalId: number;
}

export interface DeleteSleepLogIdRequest {
    logId: number;
}

export interface GetAnalysisStreamRequest {
    refresh?: boolean;
}

export interface GetApiHealthRecordsRequest {
    startTime?: Date;
    endTime?: Date;
    pageNum?: number;
    pageSize?: number;
}

export interface GetDietPageRequest {
    startDate: Date;
    endDate: Date;
    pageNum?: number;
    pageSize?: number;
}

export interface GetExerciseRequest {
    startDate: Date;
    endDate: Date;
    pageNum?: number;
    pageSize?: number;
}

export interface GetSleepPageRequest {
    startDate?: Date;
    endDate?: Date;
    pageNum?: number;
    pageSize?: number;
}

export interface PostApiAuthLoginRequest {
    loginDto?: LoginDto;
}

export interface PostApiAuthRegisterRequest {
    registerDto?: RegisterDto;
}

export interface PostApiAuthSendCodeRequest {
    email: string;
}

export interface PostApiHealthBiometricRequest {
    biometricRecordDto?: BiometricRecordDto;
}

export interface PostDietRequest {
    dietLogDto?: DietLogDto;
}

export interface PostExerciseRequest {
    exerciseLogDto?: ExerciseLogDto;
}

export interface PostHealthGoalsRequest {
    healthGoalDto?: HealthGoalDto;
}

export interface PostSleepRequest {
    sleepLogDto?: SleepLogDto;
}

/**
 *
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     * 需要登录，id为对应的记录id
     * 删除生物特征记录
     */
    async deleteApiHealthBiometricIdRaw(requestParameters: DeleteApiHealthBiometricIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        if (requestParameters['id'] == null) {
            throw new runtime.RequiredError(
              'id',
              'Required parameter "id" was null or undefined when calling deleteApiHealthBiometricId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/health/biometric/{id}`.replace(`{${"id"}}`, encodeURIComponent(String(requestParameters['id']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 需要登录，id为对应的记录id
     * 删除生物特征记录
     */
    async deleteApiHealthBiometricId(requestParameters: DeleteApiHealthBiometricIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.deleteApiHealthBiometricIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 根据记录ID删除指定记录
     * 删除饮食记录
     */
    async deleteDietLogIdRaw(requestParameters: DeleteDietLogIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        if (requestParameters['logId'] == null) {
            throw new runtime.RequiredError(
              'logId',
              'Required parameter "logId" was null or undefined when calling deleteDietLogId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/diet/{logId}`.replace(`{${"logId"}}`, encodeURIComponent(String(requestParameters['logId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 根据记录ID删除指定记录
     * 删除饮食记录
     */
    async deleteDietLogId(requestParameters: DeleteDietLogIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.deleteDietLogIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 删除运动记录
     */
    async deleteExerciseLogIdRaw(requestParameters: DeleteExerciseLogIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        if (requestParameters['logId'] == null) {
            throw new runtime.RequiredError(
              'logId',
              'Required parameter "logId" was null or undefined when calling deleteExerciseLogId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/exercise/{logId}`.replace(`{${"logId"}}`, encodeURIComponent(String(requestParameters['logId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 删除运动记录
     */
    async deleteExerciseLogId(requestParameters: DeleteExerciseLogIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.deleteExerciseLogIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 删除目标
     */
    async deleteHealthGoalsGoalIdRaw(requestParameters: DeleteHealthGoalsGoalIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        if (requestParameters['goalId'] == null) {
            throw new runtime.RequiredError(
              'goalId',
              'Required parameter "goalId" was null or undefined when calling deleteHealthGoalsGoalId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/health-goals/{goalId}`.replace(`{${"goalId"}}`, encodeURIComponent(String(requestParameters['goalId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 删除目标
     */
    async deleteHealthGoalsGoalId(requestParameters: DeleteHealthGoalsGoalIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.deleteHealthGoalsGoalIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 根据记录ID删除指定记录
     * 删除睡眠记录
     */
    async deleteSleepLogIdRaw(requestParameters: DeleteSleepLogIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        if (requestParameters['logId'] == null) {
            throw new runtime.RequiredError(
              'logId',
              'Required parameter "logId" was null or undefined when calling deleteSleepLogId().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/sleep/{logId}`.replace(`{${"logId"}}`, encodeURIComponent(String(requestParameters['logId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 根据记录ID删除指定记录
     * 删除睡眠记录
     */
    async deleteSleepLogId(requestParameters: DeleteSleepLogIdRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.deleteSleepLogIdRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 获取分析数据
     */
    async getAnalysisStreamRaw(requestParameters: GetAnalysisStreamRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<string>>> {
        const queryParameters: any = {};

        if (requestParameters['refresh'] != null) {
            queryParameters['refresh'] = requestParameters['refresh'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/analysis/stream`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse<any>(response);
    }

    /**
     *
     * 获取分析数据
     */
    async getAnalysisStream(requestParameters: GetAnalysisStreamRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<string>> {
        const response = await this.getAnalysisStreamRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 检查是否登录
     */
    async getApiAuthCheckLoginRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<GetApiAuthCheckLogin200Response>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/auth/checkLogin`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GetApiAuthCheckLogin200ResponseFromJSON(jsonValue));
    }

    /**
     *
     * 检查是否登录
     */
    async getApiAuthCheckLogin(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<GetApiAuthCheckLogin200Response> {
        const response = await this.getApiAuthCheckLoginRaw(initOverrides);
        return await response.value();
    }

    /**
     *
     * 获取最新一次生物特征记录
     */
    async getApiHealthLatestRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/health/latest`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 获取最新一次生物特征记录
     */
    async getApiHealthLatest(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getApiHealthLatestRaw(initOverrides);
        return await response.value();
    }

    /**
     * 日期为可选
     * 分页获取生物特征记录
     */
    async getApiHealthRecordsRaw(requestParameters: GetApiHealthRecordsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        if (requestParameters['startTime'] != null) {
            queryParameters['startTime'] = (requestParameters['startTime'] as any).toISOString();
        }

        if (requestParameters['endTime'] != null) {
            queryParameters['endTime'] = (requestParameters['endTime'] as any).toISOString();
        }

        if (requestParameters['pageNum'] != null) {
            queryParameters['pageNum'] = requestParameters['pageNum'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/health/records`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 日期为可选
     * 分页获取生物特征记录
     */
    async getApiHealthRecords(requestParameters: GetApiHealthRecordsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getApiHealthRecordsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 获取今天的饮食热量
     */
    async getDietHotTodayRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/diet/hot_today`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 获取今天的饮食热量
     */
    async getDietHotToday(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getDietHotTodayRaw(initOverrides);
        return await response.value();
    }

    /**
     * 支持按日期范围筛选
     * 分页查询饮食记录
     */
    async getDietPageRaw(requestParameters: GetDietPageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Page>> {
        if (requestParameters['startDate'] == null) {
            throw new runtime.RequiredError(
              'startDate',
              'Required parameter "startDate" was null or undefined when calling getDietPage().'
            );
        }

        if (requestParameters['endDate'] == null) {
            throw new runtime.RequiredError(
              'endDate',
              'Required parameter "endDate" was null or undefined when calling getDietPage().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['startDate'] != null) {
            queryParameters['startDate'] = (requestParameters['startDate'] as any).toISOString();
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['endDate'] = (requestParameters['endDate'] as any).toISOString();
        }

        if (requestParameters['pageNum'] != null) {
            queryParameters['pageNum'] = requestParameters['pageNum'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/diet/page`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PageFromJSON(jsonValue));
    }

    /**
     * 支持按日期范围筛选
     * 分页查询饮食记录
     */
    async getDietPage(requestParameters: GetDietPageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Page> {
        const response = await this.getDietPageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 分页查询运动记录
     */
    async getExerciseRaw(requestParameters: GetExerciseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        if (requestParameters['startDate'] == null) {
            throw new runtime.RequiredError(
              'startDate',
              'Required parameter "startDate" was null or undefined when calling getExercise().'
            );
        }

        if (requestParameters['endDate'] == null) {
            throw new runtime.RequiredError(
              'endDate',
              'Required parameter "endDate" was null or undefined when calling getExercise().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['startDate'] != null) {
            queryParameters['startDate'] = (requestParameters['startDate'] as any).toISOString();
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['endDate'] = (requestParameters['endDate'] as any).toISOString();
        }

        if (requestParameters['pageNum'] != null) {
            queryParameters['pageNum'] = requestParameters['pageNum'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/exercise`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 分页查询运动记录
     */
    async getExercise(requestParameters: GetExerciseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getExerciseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 获取最新的运动记录
     */
    async getExerciseLatestRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/exercise/latest`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 获取最新的运动记录
     */
    async getExerciseLatest(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getExerciseLatestRaw(initOverrides);
        return await response.value();
    }

    /**
     *
     * 导出健康数据
     */
    async getExportBiometricRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/export/biometric`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     *
     * 导出健康数据
     */
    async getExportBiometric(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.getExportBiometricRaw(initOverrides);
    }

    /**
     *
     * 导出饮食数据
     */
    async getExportDietRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/export/diet`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     *
     * 导出饮食数据
     */
    async getExportDiet(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.getExportDietRaw(initOverrides);
    }

    /**
     *
     * 导出运动数据
     */
    async getExportExerciseRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/export/exercise`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     *
     * 导出运动数据
     */
    async getExportExercise(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.getExportExerciseRaw(initOverrides);
    }

    /**
     *
     * 导出睡眠数据
     */
    async getExportSleepRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/export/sleep`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     *
     * 导出睡眠数据
     */
    async getExportSleep(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.getExportSleepRaw(initOverrides);
    }

    /**
     *
     * 获取当前目标
     */
    async getHealthGoalsCurrentRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/health-goals/current`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 获取当前目标
     */
    async getHealthGoalsCurrent(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getHealthGoalsCurrentRaw(initOverrides);
        return await response.value();
    }

    /**
     *
     * getLatest
     */
    async getSleepLatestRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/sleep/latest`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * getLatest
     */
    async getSleepLatest(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getSleepLatestRaw(initOverrides);
        return await response.value();
    }

    /**
     * 支持按入睡时间范围筛选
     * 分页查询睡眠记录
     */
    async getSleepPageRaw(requestParameters: GetSleepPageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        if (requestParameters['startDate'] != null) {
            queryParameters['startDate'] = (requestParameters['startDate'] as any).toISOString();
        }

        if (requestParameters['endDate'] != null) {
            queryParameters['endDate'] = (requestParameters['endDate'] as any).toISOString();
        }

        if (requestParameters['pageNum'] != null) {
            queryParameters['pageNum'] = requestParameters['pageNum'];
        }

        if (requestParameters['pageSize'] != null) {
            queryParameters['pageSize'] = requestParameters['pageSize'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/sleep/page`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 支持按入睡时间范围筛选
     * 分页查询睡眠记录
     */
    async getSleepPage(requestParameters: GetSleepPageRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.getSleepPageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 使用用户名/邮箱登录获取Token
     * 用户登录
     */
    async postApiAuthLoginRaw(requestParameters: PostApiAuthLoginRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/auth/login`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LoginDtoToJSON(requestParameters['loginDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 使用用户名/邮箱登录获取Token
     * 用户登录
     */
    async postApiAuthLogin(requestParameters: PostApiAuthLoginRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postApiAuthLoginRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 退出当前登录
     * 退出登录
     */
    async postApiAuthLogoutRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/auth/logout`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 退出当前登录
     * 退出登录
     */
    async postApiAuthLogout(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postApiAuthLogoutRaw(initOverrides);
        return await response.value();
    }

    /**
     * 使用邮箱验证码完成注册
     * 用户注册
     */
    async postApiAuthRegisterRaw(requestParameters: PostApiAuthRegisterRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/auth/register`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: RegisterDtoToJSON(requestParameters['registerDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 使用邮箱验证码完成注册
     * 用户注册
     */
    async postApiAuthRegister(requestParameters: PostApiAuthRegisterRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postApiAuthRegisterRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 向指定邮箱发送6位数字验证码
     * 发送验证码
     */
    async postApiAuthSendCodeRaw(requestParameters: PostApiAuthSendCodeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        if (requestParameters['email'] == null) {
            throw new runtime.RequiredError(
              'email',
              'Required parameter "email" was null or undefined when calling postApiAuthSendCode().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['email'] != null) {
            queryParameters['email'] = requestParameters['email'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/api/auth/send-code`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 向指定邮箱发送6位数字验证码
     * 发送验证码
     */
    async postApiAuthSendCode(requestParameters: PostApiAuthSendCodeRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postApiAuthSendCodeRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 需要登录，参数需符合验证规则
     * 创建生物特征记录
     */
    async postApiHealthBiometricRaw(requestParameters: PostApiHealthBiometricRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/api/health/biometric`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: BiometricRecordDtoToJSON(requestParameters['biometricRecordDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 需要登录，参数需符合验证规则
     * 创建生物特征记录
     */
    async postApiHealthBiometric(requestParameters: PostApiHealthBiometricRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postApiHealthBiometricRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 需要登录，记录饮食信息
     * 新增饮食记录
     */
    async postDietRaw(requestParameters: PostDietRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/diet`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: DietLogDtoToJSON(requestParameters['dietLogDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 需要登录，记录饮食信息
     * 新增饮食记录
     */
    async postDiet(requestParameters: PostDietRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postDietRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 需要登录，参数需满足以下要求：<br>1. 运动类型必填<br>2. 开始时间不能晚于当前时间<br>3. 持续时间至少1分钟<br>4. 卡路里消耗至少1大卡
     * 创建运动记录
     */
    async postExerciseRaw(requestParameters: PostExerciseRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/exercise`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: ExerciseLogDtoToJSON(requestParameters['exerciseLogDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 需要登录，参数需满足以下要求：<br>1. 运动类型必填<br>2. 开始时间不能晚于当前时间<br>3. 持续时间至少1分钟<br>4. 卡路里消耗至少1大卡
     * 创建运动记录
     */
    async postExercise(requestParameters: PostExerciseRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postExerciseRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     *
     * 创建健康目标
     */
    async postHealthGoalsRaw(requestParameters: PostHealthGoalsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/health-goals`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: HealthGoalDtoToJSON(requestParameters['healthGoalDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     *
     * 创建健康目标
     */
    async postHealthGoals(requestParameters: PostHealthGoalsRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postHealthGoalsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * 需要登录，参数要求：<br>1. 入睡/醒来时间不能为空且需早于当前时间<br>2. 醒来时间需晚于入睡时间<br>3. 睡眠质量等级1-5
     * 新增睡眠记录
     */
    async postSleepRaw(requestParameters: PostSleepRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<ResponseResult>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        const response = await this.request({
            path: `/sleep`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: SleepLogDtoToJSON(requestParameters['sleepLogDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => ResponseResultFromJSON(jsonValue));
    }

    /**
     * 需要登录，参数要求：<br>1. 入睡/醒来时间不能为空且需早于当前时间<br>2. 醒来时间需晚于入睡时间<br>3. 睡眠质量等级1-5
     * 新增睡眠记录
     */
    async postSleep(requestParameters: PostSleepRequest = {}, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<ResponseResult> {
        const response = await this.postSleepRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
