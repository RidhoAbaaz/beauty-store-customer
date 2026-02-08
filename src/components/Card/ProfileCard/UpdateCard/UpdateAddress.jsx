import { useEffect, useState } from "react";
import styles from './UpdateAddress.module.css';
import Input from "../../../Input/Input";
import { RequestHandler } from "../../../../helper/RequestHandler";
import LoadingAnimation from "../../../Loading/LoadingAnimation";

export default function UpdateAddress({ baseUrl, handler, addressId, setLoading, setError, setRefresh, setSuccess}) {
    const [newAddress, setnewAddress] = useState({
        receiver: "",
        phone_number: "",
        address: "",
    })

    const [animation, setAnimation] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setAnimation(true);
            try {
                const response = await RequestHandler(`${baseUrl}/address/${addressId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setnewAddress(response.address);
            } catch (error) {
                setError(error.message);
                setTimeout(() => {
                    setError("");
                    handler("");
                }, 3000);
            } finally {
                setAnimation(false);
            }
        }
        fetchData();
    }, [baseUrl, addressId, setError, handler])

    const handleSubmit = async (e) => {
        e.preventDefault();
        handler("");
        setLoading(true);

        try {
            const response = await RequestHandler(`${baseUrl}/address/${addressId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newAddress)
            });
            setSuccess(response.message);
            setTimeout(() => {
                setSuccess("");
                setRefresh(prev => !prev);
            }, 3000);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(""), 3000);
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (name, value) => {
        setnewAddress(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                {
                    animation ? <LoadingAnimation /> : (
                        <form className={styles.layout} onSubmit={handleSubmit}>
                            <h4 className={styles.header}>Update Address</h4>
                            <Input name="receiver" label="Receiver" value={newAddress.receiver} handler={ handleChange } placeholder="Input Receiver Name" type="text"/>
                            <Input name="phone_number" label="Phone Number" value={newAddress.phone_number} handler={ handleChange } placeholder="Input Phone Number" type="number"/>
                            <div className={styles.addressWrapper}>
                                <label htmlFor="Address" className={styles.label}>Address</label>
                                <textarea 
                                    name="address" 
                                    id="Address" 
                                    className={styles.addressInput} 
                                    value={newAddress.address} 
                                    onChange={(e) => handleChange(e.target.name, e.target.value)}
                                    placeholder="Input Address"
                                    >
                                </textarea>
                            </div>
                            <div className={styles.btnWrapper}>
                                <button type="submit" className={styles.backBtn}>Update Address</button>
                                <button className={styles.backBtn} onClick={() => handler("")}>Close</button>
                            </div>
                        </form>
                    )
                }
            </div>
        </div>
    )
}