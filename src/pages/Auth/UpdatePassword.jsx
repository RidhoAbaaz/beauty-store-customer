import { useContext, useState } from 'react';
import styles from '../../assets/styles/Auth/Auth.module.css';
import Input from '../../components/Input/Input'
import { Link, useNavigate } from 'react-router-dom';
import { BaseUrl } from '../../context/BaseUrl';
import { RequestHandler } from '../../helper/RequestHandler';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';
import SuccessCard from '../../components/Card/SuccessCard/SuccessCard';

export default function UpdatePassword() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        name: "",
        password: "",
        confirm_password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const baseUrl = useContext(BaseUrl);
    const navigation = useNavigate();

    const handleChange = (name, value) => {
        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await RequestHandler(`${baseUrl}/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            setSuccessMessage(response.message);
            setTimeout(() => {
                setSuccessMessage("");
                navigation("/login");
            }, 3000)
        } catch (error) {
            setErrorMessage(error.message);
            setTimeout(() => setErrorMessage(""), 3000)
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <section className={styles.pageLayout}>
            <div className={styles.card}>
                <form className={styles.inputWrapp} onSubmit={handleSubmit} >
                    <h3 className={styles.title}>Update Password</h3>
                    <Input name="name" label="Username" value={ data.name } handler={ handleChange } type="text"  placeholder="Input Username"/>
                    <div className={styles.passwordWrap}>
                        <Input name="password" label="Password" value={ data.password } handler={ handleChange } type={show ? "text" : "password"}  placeholder="Input Password" />
                        {
                            show ? <i className="bi bi-eye" onClick={() => setShow(prev => !prev)}></i> : <i className="bi bi-eye-slash" onClick={ () => setShow(prev => !prev)}></i>
                        }
                    </div>
                    <div className={styles.passwordWrap}>
                        <Input name="confirm_password" label="Confirm Password" value={ data.confirm_password } handler={ handleChange } type={show ? "text" : "password"}  placeholder="Confirm Password" />
                        {
                            show ? <i className="bi bi-eye" onClick={() => setShow(prev => !prev)}></i> : <i className="bi bi-eye-slash" onClick={ () => setShow(prev => !prev)}></i>
                        }
                    </div>
                    <button className={styles.submitBtn} type="submit">Update Password</button>
                    <Link className={styles.submitBtn} to={`/login`}>
                        <p className={styles.text}>Back to Login</p>
                    </Link>
                </form>
            </div>
            { loading && <LoadingCard /> }
            { errorMessage && <ErrorCard message={errorMessage} /> }
            { successMessage && <SuccessCard message={errorMessage} /> }
        </section>
    )

}