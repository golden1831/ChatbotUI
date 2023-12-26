import React from 'react';

import { Box } from "@chakra-ui/react";
import { Radio, Space } from 'antd';

const RadioCard = (props) => {
    return (
        <>
            <Box textAlign={"center"}>
                <Box as="b" fontWeight={"bold"} fontSize={"18px"}>{props.title}
                </Box>
            </Box>
            <Radio.Group defaultValue="a" buttonStyle="solid" onChange={props.onChange} value={props.value}>
                <Space direction="vertical">
                {props.data.map((value) => {
                    return <Radio.Button value={value}>{value}</Radio.Button>
                })}
                <Radio.Button value={"No list"} style={{ borderColor: 'red' }}>No list</Radio.Button>
            </Space>
            </Radio.Group>
        </>
    )
}

export default RadioCard;