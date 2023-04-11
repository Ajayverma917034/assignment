

const tryCatch = (controller) => {
    return async (req, res) => {
        // console.log(req)
        try {
            await controller(req, res);
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: 'Something went wrong! try again later' })
        }
    }
}

export default tryCatch