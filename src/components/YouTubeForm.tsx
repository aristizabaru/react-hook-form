import { useForm } from 'react-hook-form';
import { DevTool } from "@hookform/devtools";

let renderCount = 0;

type FormValues = {
    username: string;
    email: string;
    channel: string;
};

export const YouTubeForm = () => {
    const form = useForm<FormValues>();

    const {
        register,
        control,
        handleSubmit,
        formState,
    } = form;

    const {
        errors,
    } = formState;

    const onSubmit = ( data: FormValues ) => {
        console.log( "Form submitted", data );
    };

    return (
        <div>
            <span>Form renders: { ++renderCount / 2 }</span>
            <h1>YouTube Form</h1>

            <form onSubmit={ handleSubmit( onSubmit ) } noValidate>
                <div className="form-control">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        { ...register( "username", {
                            required: { value: true, message: "Username is required" },
                        } ) }
                    />
                    <p className="error">{ errors.username?.message }</p>
                </div>

                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input
                        type="email"
                        id="email"
                        { ...register( "email", {
                            pattern: {
                                value:
                                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                                message: "Invalid email format",
                            },
                            validate: ( fieldValue ) => {
                                // Si no pasa la validación retorna el mensaje de error
                                return fieldValue !== "admin@example.com" || "Enter a different email address";
                            }
                        } ) }
                    />
                    <p className="error">{ errors.email?.message }</p>
                </div>

                <div className="form-control">
                    <label htmlFor="channel">Channel</label>
                    <input
                        type="text"
                        id="channel"
                        { ...register( "channel", {
                            required: {
                                value: true,
                                message: "Channel is required"
                            },
                        } ) }
                    />
                    <p className="error">{ errors.channel?.message }</p>
                </div>

                <button>Submit</button>
            </form>

            <DevTool control={ control } />
        </div>
    );
};