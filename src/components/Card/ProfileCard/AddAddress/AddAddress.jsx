import { useState } from "react";
import styles from './AddAddress.module.css';
import Input from "../../../Input/Input";
import { RequestHandler } from "../../../../helper/RequestHandler";

export default function AddAddress({ handler, setRefresh, setLoading, setError, setSuccess, baseUrl }) {
    const [newAddress, setnewAddress] = useState({
        receiver: "",
        address: "",
        phone_number: ""
    });
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        handler("");
        setLoading(true);
        try {
            const response = await RequestHandler(`${baseUrl}/address`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(newAddress)
            });
            setSuccess(response.message);
            setTimeout(() => {
                setSuccess("")
                setRefresh(prev => !prev);
            }, 3000);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(""), 3000)
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
            <form className={styles.layout} onSubmit={handleSubmit}>
                <h4 className={styles.header}>Add Address</h4>
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
                    <button type="submit" className={styles.backBtn}>Add Address</button>
                    <button className={styles.backBtn} onClick={() => handler("")}>Close</button>
                </div>
            </form>
        </div>
    )
}