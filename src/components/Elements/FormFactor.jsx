import React from 'react';

import { Box } from "@chakra-ui/react";

const FormFactor = (props) => {
    return (
        <>
            <Box textAlign={"center"}>
                <Box as="b" fontWeight={"bold"} fontSize={"18px"}>Form Foctors about product
                </Box>
                <table className="chat_table">
                    <thead>
                        <tr>
                        <th>Type</th>
                        <th>Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.formFactor.map((item, index) => 
                        <tr key={`tr${index}`}>
                            <td>{item.container}</td>
                            <td>{item.volume}</td>
                        </tr>
                        )}
                    </tbody>
                 </table>
            </Box>
        </>
    )
}

export default FormFactor;