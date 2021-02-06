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
}

export type Query = {
  __typename?: 'Query'
  authenticate: UserResponse
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

export type Mutation = {
  __typename?: 'Mutation'
  register: UserResponse
  login: UserResponse
  logout: Scalars['Boolean']
}

export type MutationRegisterArgs = {
  params: UserInput
}

export type MutationLoginArgs = {
  params: UserInput
}

export type UserInput = {
  email: Scalars['String']
  password: Scalars['String']
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
