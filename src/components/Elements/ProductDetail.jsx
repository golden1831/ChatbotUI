import React from 'react';

import { Box } from "@chakra-ui/react";

const ProductDetail = (props) => {

    let data = [];
    Object.keys(props.pData).map(item =>  data.push({ key: item, data: props.pData[item] }))

    return (
        <>
            <Box textAlign={"center"}>
                <Box as="b" fontWeight={"bold"} fontSize={"18px"}>
                    Product Details
                </Box>
                {data.map((item, index) => 
                    item.key !== 'image' ? 
                        (
                            <p key={`image${index}`}>
                                <b style={{ textTransform: 'uppercase' }}>{item.key}: 
                                </b>
                                <span> 
                                    {item.data}
                                </span></p>
                        )
                        : 
                        (
                            <Box display={'flex'} flexDirection={'column'} gap={'10px'} justifyContent={'center'} alignItems={'center'}>
                                {item?.data?.map((item) => <img src={item} alt="" width={'100px'} height={'100px'} />)}
                            </Box>
                        ) 
                )}
            </Box>
        </>
    )
}

export default ProductDetail;