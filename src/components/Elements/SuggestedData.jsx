import React from 'react';

import { Box } from "@chakra-ui/react";

const SuggestedData = (props) => {
    return (
        <><Box textAlign={"center"}><Box as="b" fontWeight={"bold"} fontSize={"18px"}>Suggested Product Title Based on the location</Box><table className="chat_table">
    <thead>
      <tr>
        <th>Type</th>
        <th>Title</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Local Name</td>
        <td>{props.suggestedData.localname}</td>
      </tr>
      <tr>
      <td>International Recognized Brand</td>
        <td>{props.suggestedData.internationalrecognizedbrand}</td>
      </tr>
      <tr>
      <td>Colloquial/Popular terms</td>
        <td>{props.suggestedData.colloquial}</td>
      </tr>
      <tr>
      <td>Additional Relevant Name</td>
      <td>{props.suggestedData.additionalrelevantnames}</td>
      </tr>
    </tbody>
    </table></Box></>
    )
}

export default SuggestedData;