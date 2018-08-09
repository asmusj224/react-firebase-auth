import React from 'react';
import { withRouter } from 'react-router-dom';
import { withFormik } from 'formik';
import * as yup from 'yup';

import { auth } from '../firebase';
import * as routes from '../constants/routes';
import SignUpLink from '../SignUp/link';

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

            <button disabled={!isValid} type="submit">Sign Up</button>

            {errors && <p>{errors.message}</p>}

            <SignUpLink />
        </form>
    );

const SignInForm = withFormik({
    mapPropsToValues: () => ({ email: '', password: '' }),
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
                .min(6, 'Password must be 8 characters long')
                .required('Password is required')
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

        auth.doSignInWithEmailAndPassword(email, password)
            .then(() => {
                history.push(routes.HOME);
            })
            .catch(error => {
                setErrors(error);
            });
    },
})(InnerForm);


export default withRouter(SignInForm);