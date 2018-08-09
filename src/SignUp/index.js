import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import * as yup from 'yup';

import { auth } from '../firebase';
import * as routes from '../constants/routes';
import { passwordRequiredMessage } from '../constants/validationMessages'

const InnerForm = ({
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid
}) => (
        <form onSubmit={handleSubmit}>
            <input
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                name="email"
                type="text"
                placeholder="Email Address"
            />
            {touched.email && errors.email && <div>{errors.email}</div>}
            <input
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="Password"
            />
            {touched.password && errors.password && <div>{errors.password}</div>}
            <input
                value={values.passwordConfirm}
                onChange={handleChange}
                onBlur={handleBlur}
                name="passwordConfirm"
                type="password"
                placeholder="Confirm Password"
            />

            {touched.passwordConfirm && errors.passwordConfirm && <div>{errors.passwordConfirm}</div>}
            <button disabled={!isValid} type="submit">Sign Up</button>
            {errors && <p>{errors.message}</p>}
        </form>
    );

const SignUpForm = withFormik({
    mapPropsToValues: () => ({ email: '', password: '', passwordConfirm: '' }),
    validationSchema: () => {
        return yup.object().shape({
            email: yup
                .string()
                .trim()
                .email('Please enter a valid email')
                .required('Email is required'),
            password: yup
                .string()
                .trim()
                .min(6, passwordRequiredMessage)
                .matches(/[a-z]/, passwordRequiredMessage)
                .matches(/[A-Z]/, passwordRequiredMessage)
                .matches(/[\d]/, passwordRequiredMessage)
                .matches(/_|[^\w]/, passwordRequiredMessage)
                .required(passwordRequiredMessage),
            passwordConfirm: yup
                .string()
                .trim()
                .oneOf([yup.ref('password'), null], "Your passwords don't match")
                .required(passwordRequiredMessage)
        });
    },
    handleSubmit: (
        values,
        {
            props,
            setErrors,
        }
    ) => {
        const {
            history,
        } = props;

        const {
            email,
            password
        } = values;


        auth.doCreateUserWithEmailAndPassword(email, password)
            .then(() => {
                history.push(routes.HOME);
            })
            .catch(error => {
                setErrors(error);
            });
    },
})(InnerForm);


export default withRouter(SignUpForm);