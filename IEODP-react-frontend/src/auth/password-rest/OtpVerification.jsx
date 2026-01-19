
const OtpVerification = ({ inputRefs, onSubmitHandler, loading }) => {

    const handleInput = (e, i) => {
        if (e.target.value.length > 0 && i < inputRefs.current.length - 1) {
            inputRefs.current[i + 1].focus(); // Move focus to the next input field
        }
    }

    const handleKeyDown = (e, i) => {
        if (e.key === 'Backspace' && e.target.value === '' && i > 0) {
            inputRefs.current[i - 1].focus(); // Move focus to the previous input field
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text')
        const pasteArray = paste.split('')
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    }
    return (
        <div> <div className='p-4 border rounded-lg shadow-lg bg-base-100 w-96'>
            <form className='card' onSubmit={onSubmitHandler}>
                <div className='card-body'>
                    <h1 className='text-xl card-title'>Email verify OTP</h1>
                    <h1 className='text-sm'>Enter 6 Digit verification code</h1>
                    <div className='flex justify-between gap-1 mb-4' onPaste={handlePaste}>
                        {
                            Array(6).fill(0).map((_, i) => (

                                <input type="number" className='input' maxLength='1' key={i} required
                                    ref={e => inputRefs.current[i] = e}
                                    onInput={(e) => handleInput(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                />
                            ))
                        }
                    </div>
                    {loading ? <button className='mt-2 btn btn-neutral'><span className="loading loading-spinner loading-lg"></span></button> :
                        <button type='submit' className="mt-2 btn btn-neutral">Verify Email</button>
                    }
                </div>
            </form>
        </div></div>
    )
}

export default OtpVerification