import React from "react" 
import { motion } from "framer-motion"
import PLUS_ICON from '../../assets/plus.png'

type Props = {
    value: string,
    onClick: () => void
  }

const Button = ({value, onClick}:Props) => {
    return (
        <motion.button className='w-20 bg-orange-900 rounded text-white flex justify-center items-center gap-2'
            initial={{ opacity: 0.6 }}
            whileHover={{scale: 1.1,
                transition: { duration: 0.2 },
            }}
            whileTap={{ scale: 0.9 }}
            whileInView={{ opacity: 1 }} onClick={onClick}>
                <img src={PLUS_ICON} style={{width: 25}}/>
                {value}
       </motion.button>
    )
}

export default Button