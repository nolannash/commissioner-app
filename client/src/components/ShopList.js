import React from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import {
  Typography,
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
} from '@mui/material';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 200, // Adjust this value as needed to control the shop card's height
});

const ShopList = ({ shops }) => {
  const { user } = React.useContext(AuthContext);

  const rowRenderer = ({ index, key, parent, style }) => {
    const shop = shops[index];

    return (
      <CellMeasurer key={key} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
        <div style={style}>
          <Card key={shop.id} sx={{ margin: '8px', width: '600px' }}>
            <CardHeader title={shop.shopname} />
            <CardMedia
              component="img"
              height={100} // Adjust this value to control the shop logo's height
              image={`/uploads/${shop.logo_banner}`} // Make sure to provide the correct path for the logo
              alt={`Shop ${shop.id}`}
            />
            <CardContent>
              <Typography variant="body1">{shop.bio}</Typography>
            </CardContent>
          </Card>
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            rowCount={shops.length}
            overscanRowCount={3}
          />
        )}
      </AutoSizer>
    </div>
  );
};

export default ShopList;