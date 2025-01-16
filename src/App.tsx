import axios from 'axios';
import { useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Grid, Grid2, List, ListItem, ListItemText, Typography } from '@mui/material';

interface ProductList {
	data: Product[]
}

interface Product {
	id: number
	name: string
	price: number
	stock: 29,
	model: string,
	sizes: number[]
	colors: string[]
	description: string
	created_at: string
	updated_at: string
}

function App() {
	const [data, setData] = useState<ProductList>();

	useEffect(() => {

		const handleFetchData = async () => {
			try {
				const response = await axios.get<ProductList>('http://192.168.0.2:8002/api/v1/products')
				setData(response.data)
			} catch (error) {
				console.log(error);
			}
		}

		handleFetchData()

	}, [])

	return (
		<>
			<Card>
				<CardContent>
					<Grid container spacing={2}>
						<Grid item xs={12} md={6}>
							<Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
								Text only
							</Typography>
							<List>
								{data?.data.map((item) => (

									<ListItem>
										<ListItemText
											primary={item.name}
										/>
									</ListItem>
								)
								)}
							</List>
						</Grid>
					</Grid>
				</CardContent>
				<CardActions>
					<Button size="small">Learn More</Button>
				</CardActions>
			</Card>
		</>
	)
}

export default App
