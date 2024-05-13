import { useForm, useFieldArray } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { useEffect } from 'react';

let renderCount = 0;

type FormValues = {
    username: string;
    email: string;
    channel: string;
    social: {
        x: string,
        linkedin: string,
    };
    phoneNumbers: string[];
    phNumbers: {
        number: string;
    }[];
    age: number;
    birthday: Date;
};

export const YouTubeForm = () => {
    const form = useForm<FormValues>( {
        // El objeto de configuración permite pasar valores por defecto
        defaultValues: async (): Promise<FormValues> => {

            const response = await fetch( 'https://jsonplaceholder.typicode.com/users/1' );
            const data = await response.json();

            return {
                username: 'Batman',
                email: data?.email,
                channel: 'aristizabaru',
                social: {
                    x: '',
                    linkedin: '',
                },
                phoneNumbers: [ '', '' ],
                phNumbers: [ { number: '' } ],
                age: 0,
                birthday: new Date(),
            };
        }
    } );

    const {
        register,
        control,
        handleSubmit,
        formState,
        watch,
        getValues,
        setValue,
    } = form;

    const {
        errors,
        dirtyFields,
        touchedFields,
        isDirty,
    } = formState;

    console.log( { touchedFields, dirtyFields, isDirty } );

    const { fields, append, remove } = useFieldArray( {
        name: 'phNumbers',
        control
    } );

    // Para implementar un side effect después de ver un valor
    // useEffect( () => {
    //     const subscription = watch( value => {
    //         console.log( value );
    //     } );

    //     return () => subscription.unsubscribe();
    // }, [ watch ] );

    // const watchUserName = watch( 'username' );

    const onSubmit = ( data: FormValues ) => {
        console.log( 'Form submitted', data );
    };

    // getValues es una mejor opción para conseguir los datos que watch ya que no necesita
    // estar escuchando activamente los campos y no genera necesariamente re-renders
    const handleGetValues = () => {
        console.log( 'getValues:', getValues() );
    };

    const handleSetNameValue = () => {
        setValue( 'username', '', {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true,
        } );
    };

    return (
        <div>
            <span>Form renders: { ++renderCount / 2 }</span>
            <h1>YouTube Form</h1>
            {/* <h2>Watched value: { watchUserName }</h2> */ }
            <form onSubmit={ handleSubmit( onSubmit ) } noValidate>
                <div className='form-control'>
                    <label htmlFor='username'>Username</label>
                    <input
                        type='text'
                        id='username'
                        { ...register( 'username', {
                            required: { value: true, message: 'Username is required' },
                        } ) }
                    />
                    <p className='error'>{ errors.username?.message }</p>
                </div>

                <div className='form-control'>
                    <label htmlFor='email'>E-mail</label>
                    <input
                        type='email'
                        id='email'
                        { ...register( 'email', {
                            pattern: {
                                value:
                                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: 'Invalid email format',
                            },
                            validate: {
                                notAdmin: ( fieldValue ) => {
                                    // Si no pasa la validación retorna el mensaje de error
                                    return fieldValue !== 'admin@example.com' || 'Enter a different email address';
                                },
                                notBlacklisted: ( fieldValue ) => {
                                    // Si no pasa la validación retorna el mensaje de error
                                    return !fieldValue.endsWith( 'baddomain.com' ) || 'This domain is not supported';
                                }
                            }
                        } ) }
                    />
                    <p className='error'>{ errors.email?.message }</p>
                </div>

                <div className='form-control'>
                    <label htmlFor='channel'>Channel</label>
                    <input
                        type='text'
                        id='channel'
                        { ...register( 'channel', {
                            required: {
                                value: true,
                                message: 'Channel is required'
                            },
                        } ) }
                    />
                    <p className='error'>{ errors.channel?.message }</p>
                </div>

                <div className='form-control'>
                    <label htmlFor='x'>X</label>
                    <input type='text' id='x' { ...register( 'social.x',
                        {
                            disabled: watch( 'channel' ) === ''
                        }
                    ) } />
                </div>

                <div className='form-control'>
                    <label htmlFor='linkedin'>Linkedin</label>
                    <input type='text' id='linkedin' { ...register( 'social.linkedin' ) } />
                </div>

                <div className='form-control'>
                    <label htmlFor='primary-phone'>Primary phone number</label>
                    <input type='text' id='primary-phone' { ...register( 'phoneNumbers.0' ) } />
                </div>

                <div className='form-control'>
                    <label htmlFor='secondary-phone'>Secondary phone number</label>
                    <input type='text' id='secondary-phone' { ...register( 'phoneNumbers.1' ) } />
                </div>

                <div>
                    <label>List of phone numbers</label>
                    <div>
                        {
                            fields.map( ( field, index ) => (
                                <div className='form-control' key={ field.id }>
                                    <input type="text" { ...register( `phNumbers.${ index }.number` ) } />
                                    {
                                        index > 0 && (
                                            <button type='button' onClick={ () => remove( index ) }>
                                                Remove
                                            </button>
                                        )
                                    }
                                </div>
                            ) )
                        }
                        <button type='button' onClick={ () => append( { number: '' } ) }>
                            Add phone number
                        </button>
                    </div>
                </div>

                <div className='form-control'>
                    <label htmlFor='age'>Age</label>
                    <input
                        type='number'
                        id='age'
                        { ...register( 'age', {
                            valueAsNumber: true,
                            required: {
                                value: true,
                                message: 'Age is required'
                            },
                        } ) }
                    />
                    <p className='error'>{ errors.age?.message }</p>
                </div>

                <div className='form-control'>
                    <label htmlFor='birthday'>Birthday</label>
                    <input
                        type='date'
                        id='birthday'
                        { ...register( 'birthday', {
                            valueAsDate: true,
                            required: {
                                value: true,
                                message: 'Birthday is required'
                            },
                        } ) }
                    />
                    <p className='error'>{ errors.birthday?.message }</p>
                </div>

                <button>Submit</button>
                <button type='button' onClick={ handleGetValues }>Get values</button>
                <button type='button' onClick={ handleSetNameValue }>Set name value</button>
            </form>

            <DevTool control={ control } />
        </div>
    );
};