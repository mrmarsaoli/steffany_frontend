export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
}

export type Query = {
  __typename?: 'Query'
  authenticate: UserResponse
  shift: ShiftResponse
  shifts: ShiftListResponse
}

export type QueryShiftArgs = {
  id: Scalars['Int']
}

export type QueryShiftsArgs = {
  params: ShiftListInput
}

export type UserResponse = {
  __typename?: 'UserResponse'
  errors: Array<FieldError>
  user?: Maybe<User>
  accessToken?: Maybe<Scalars['String']>
}

export type FieldError = {
  __typename?: 'FieldError'
  field: Scalars['String']
  message: Scalars['String']
}

export type User = {
  __typename?: 'User'
  id: Scalars['Int']
  email: Scalars['String']
  tokenVersion: Scalars['Int']
}

export type ShiftResponse = {
  __typename?: 'ShiftResponse'
  errors: Array<FieldError>
  shift?: Maybe<Shift>
}

export type Shift = {
  __typename?: 'Shift'
  id: Scalars['Int']
  user: User
  name: Scalars['String']
  start: Scalars['String']
  end: Scalars['String']
  created: Scalars['String']
  updated: Scalars['String']
  published: Scalars['Int']
}

export type ShiftListResponse = {
  __typename?: 'ShiftListResponse'
  error?: Maybe<FieldError>
  shifts?: Maybe<Array<Shift>>
}

export type ShiftListInput = {
  orderBy?: Maybe<Scalars['String']>
  desc?: Maybe<Scalars['Boolean']>
  limit?: Maybe<Scalars['Int']>
  offset?: Maybe<Scalars['Int']>
  id?: Maybe<Scalars['Int']>
  user?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  start?: Maybe<Scalars['String']>
  end?: Maybe<Scalars['String']>
  created?: Maybe<Scalars['String']>
  updated?: Maybe<Scalars['String']>
  published?: Maybe<Scalars['String']>
}

export type Mutation = {
  __typename?: 'Mutation'
  register: UserResponse
  login: UserResponse
  logout: Scalars['Boolean']
  createShift: ShiftResponse
  editShift: ShiftResponse
  deleteShift: DeleteShiftResponse
  publishShift: PublishShiftResponse
}

export type MutationRegisterArgs = {
  params: UserInput
}

export type MutationLoginArgs = {
  params: UserInput
}

export type MutationCreateShiftArgs = {
  params: CreateShiftInput
}

export type MutationEditShiftArgs = {
  params: EditShiftInput
}

export type MutationDeleteShiftArgs = {
  id: Scalars['Int']
}

export type MutationPublishShiftArgs = {
  ids: Array<Scalars['Int']>
}

export type UserInput = {
  email: Scalars['String']
  password: Scalars['String']
}

export type CreateShiftInput = {
  name: Scalars['String']
  start: Scalars['DateTime']
  end: Scalars['DateTime']
  published: Scalars['Int']
}

export type EditShiftInput = {
  name: Scalars['String']
  start: Scalars['DateTime']
  end: Scalars['DateTime']
  published: Scalars['Int']
  id: Scalars['Int']
}

export type DeleteShiftResponse = {
  __typename?: 'DeleteShiftResponse'
  error?: Maybe<FieldError>
  deleted?: Maybe<Scalars['Boolean']>
}

export type PublishShiftResponse = {
  __typename?: 'PublishShiftResponse'
  error?: Maybe<FieldError>
  bulkingErrors: Array<BulkingError>
  success: Scalars['Boolean']
}

export type BulkingError = {
  __typename?: 'BulkingError'
  field: Scalars['String']
  message: Scalars['String']
  id: Scalars['Int']
}

export type CreateShiftMutationVariables = Exact<{
  params: CreateShiftInput
}>

export type CreateShiftMutation = { __typename?: 'Mutation' } & {
  createShift: { __typename?: 'ShiftResponse' } & {
    errors: Array<
      { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
    >
    shift?: Maybe<{ __typename?: 'Shift' } & Pick<Shift, 'id' | 'name'>>
  }
}

export type DeleteShiftMutationVariables = Exact<{
  id: Scalars['Int']
}>

export type DeleteShiftMutation = { __typename?: 'Mutation' } & {
  deleteShift: { __typename?: 'DeleteShiftResponse' } & Pick<
    DeleteShiftResponse,
    'deleted'
  > & {
      error?: Maybe<
        { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
      >
    }
}

export type ShiftDetailQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type ShiftDetailQuery = { __typename?: 'Query' } & {
  shift: { __typename?: 'ShiftResponse' } & {
    errors: Array<
      { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
    >
    data?: Maybe<
      { __typename?: 'Shift' } & Pick<
        Shift,
        'id' | 'name' | 'start' | 'end' | 'published'
      >
    >
  }
}

export type EditShiftMutationVariables = Exact<{
  params: EditShiftInput
}>

export type EditShiftMutation = { __typename?: 'Mutation' } & {
  editShift: { __typename?: 'ShiftResponse' } & {
    errors: Array<
      { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
    >
    shift?: Maybe<{ __typename?: 'Shift' } & Pick<Shift, 'id' | 'name'>>
  }
}

export type ShiftListQueryVariables = Exact<{
  params: ShiftListInput
}>

export type ShiftListQuery = { __typename?: 'Query' } & {
  shifts: { __typename?: 'ShiftListResponse' } & {
    error?: Maybe<
      { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
    >
    data?: Maybe<
      Array<
        { __typename?: 'Shift' } & Pick<
          Shift,
          'id' | 'name' | 'start' | 'end' | 'published'
        >
      >
    >
  }
}

export type PublishShiftMutationVariables = Exact<{
  ids: Array<Scalars['Int']> | Scalars['Int']
}>

export type PublishShiftMutation = { __typename?: 'Mutation' } & {
  publishShift: { __typename?: 'PublishShiftResponse' } & Pick<
    PublishShiftResponse,
    'success'
  > & {
      error?: Maybe<
        { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
      >
      bulkingErrors: Array<
        { __typename?: 'BulkingError' } & Pick<
          BulkingError,
          'field' | 'message' | 'id'
        >
      >
    }
}

export type AuthenticateQueryVariables = Exact<{ [key: string]: never }>

export type AuthenticateQuery = { __typename?: 'Query' } & {
  authenticate: { __typename?: 'UserResponse' } & {
    errors: Array<
      { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
    >
    user?: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'email'>>
  }
}

export type LoginMutationVariables = Exact<{
  params: UserInput
}>

export type LoginMutation = { __typename?: 'Mutation' } & {
  login: { __typename?: 'UserResponse' } & Pick<UserResponse, 'accessToken'> & {
      errors: Array<
        { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
      >
      user?: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'email'>>
    }
}

export type LogoutMutationVariables = Exact<{ [key: string]: never }>

export type LogoutMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'logout'
>

export type RegisterMutationVariables = Exact<{
  params: UserInput
}>

export type RegisterMutation = { __typename?: 'Mutation' } & {
  register: { __typename?: 'UserResponse' } & {
    errors: Array<
      { __typename?: 'FieldError' } & Pick<FieldError, 'field' | 'message'>
    >
    user?: Maybe<{ __typename?: 'User' } & Pick<User, 'id' | 'email'>>
  }
}

export interface PossibleTypesResultData {
  possibleTypes: {
    [key: string]: string[]
  }
}
const result: PossibleTypesResultData = {
  possibleTypes: {}
}
export default result
