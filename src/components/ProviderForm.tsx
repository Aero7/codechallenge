import React, { useState } from 'react';
import RegexInput from './RegexInput';
import type { ProviderData } from '../App';
import { PROVIDER_INPUT_ERROR_MESSAGES, PROVIDER_FIELD_TITLES } from '../constants';

interface ProviderFormProps {
    onSubmit: (provider: ProviderData) => void;
}

const initialState: ProviderData = {
    first_name: '',
    last_name: '',
    email_address: '',
    specialty: '',
    practice_name: '',
};

const regexes = {
    first_name: /^[a-zA-Z\s'-]{2,}$/,
    last_name: /^[a-zA-Z\s'-]{2,}$/,
    email_address: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    specialty: /^[a-zA-Z\s'-]{2,}$/,
    practice_name: /^.{2,}$/,
};

export const REQUIRED_FIELDS: (keyof ProviderData)[] = ['first_name', 'last_name', 'email_address'];

export default function ProviderForm({ onSubmit }: ProviderFormProps) {
    const [fields, setFields] = useState<ProviderData>(initialState);
    const [touched, setTouched] = useState<Record<keyof ProviderData, boolean>>({
        last_name: false,
        first_name: false,
        email_address: false,
        specialty: false,
        practice_name: false,
    });

    const isValid = (key: keyof ProviderData) => {
        if (REQUIRED_FIELDS.includes(key) && !fields[key].trim()) return false;
        if (!REQUIRED_FIELDS.includes(key) && fields[key].trim() === '') return true;
        return regexes[key].test(fields[key]);
    };

    const allValid = (Object.keys(fields) as (keyof ProviderData)[]).every(
        (key) => isValid(key)
    );

    const handleChange = (key: keyof ProviderData) => (value: string) => {
        setFields({ ...fields, [key]: value });
        setTouched({ ...touched, [key]: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({
            last_name: true,
            first_name: true,
            email_address: true,
            specialty: true,
            practice_name: true,
        });
        if (allValid) {
            onSubmit(fields);
            setFields(initialState);
            setTouched({
                last_name: false,
                first_name: false,
                email_address: false,
                specialty: false,
                practice_name: false,
            });
        }
    };

    const errorShown = (key: keyof ProviderData) => {
        return !isValid(key) && touched[key];
    }

    const inputFields = Object.keys(fields) as (keyof ProviderData)[];

    return (
        <div id="provider-form">
            <div className="card border-primary">
                <div className="card-header">Create Provider</div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {inputFields.map((key) => (
                            <div key={key} className="input-group mb-3">
                                <RegexInput
                                    field={key}
                                    value={fields[key]}
                                    onChange={handleChange(key)}
                                    regex={regexes[key]}
                                    errorMessage={errorShown(key) ? PROVIDER_INPUT_ERROR_MESSAGES[key] : ''}
                                    placeholder={PROVIDER_FIELD_TITLES[key]}
                                />
                            </div>
                        ))}

                        <button type="submit" className='btn btn-primary' disabled={!allValid} data-testid="submit-btn">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

