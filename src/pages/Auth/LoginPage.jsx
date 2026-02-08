import { useContext, useState } from 'react';
import styles from '../../assets/styles/Auth/Auth.module.css';
import Input from '../../components/Input/Input'
import { Link, useNavigate } from 'react-router-dom';
import { RequestHandler } from '../../helper/RequestHandler';
import { BaseUrl } from '../../context/BaseUrl';
import LoadingCard from '../../components/Card/LoadingCard/LoadingCard';
import ErrorCard from '../../components/Card/ErrorCard/ErrorCard';

export default function LoginPage() {
    const [show, setShow] = useState(false);
    const [data, setData] = useState({
        name: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const baseUrl = useContext(BaseUrl);

    const navigation = useNavigate();

    const handleChange = (name, value) => {
        setData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await RequestHandler(`${baseUrl}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            localStorage.setItem("token", response.token);
            navigation('/home');
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
                    <h3 className={styles.title}>Sign In</h3>
                    <Input name="name" label="Username" value={ data.name } handler={handleChange} type="text"  placeholder="Input Username"/>
                    <div className={styles.passwordWrap}>
                        <Input name="password" label="Password" value={ data.password } handler={ handleChange } type={show ? "text" : "password"}  placeholder="Input Password" />
                        {
                            show ? <i className="bi bi-eye" onClick={() => setShow(prev => !prev)}></i> : <i className="bi bi-eye-slash" onClick={ () => setShow(prev => !prev)}></i>
                        }
                    </div>
                    <div className={styles.linkWrapper}>
                        <Link className={styles.forgotPw} to={`/update`}>
                            <p>Forgot Password?</p>
                        </Link>
                        <Link className={styles.forgotPw} to={`/register`}>
                            <p>Dont Have Account?</p>
                        </Link>
                    </div>
                    <button className={styles.submitBtn} type="submit">Login</button>
                </form>
            </div>
            { loading && <LoadingCard /> }
            { errorMessage && <ErrorCard message={errorMessage} /> }
        </section>
    )
}