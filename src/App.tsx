import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box, Checkbox, Chip, Divider, FormControlLabel, FormGroup, Grid, Slider, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import { esES } from '@mui/x-data-grid/locales';

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

const paginationModel = { page: 0, pageSize: 5 };

const colors = [
	{
		label: 'Rojo',
		color: 'red'
	},
	{
		label: 'Azul',
		color: 'blue'
	},
	{
		label: 'Cafe',
		color: 'brown'
	},
	{
		label: 'Blanco',
		color: 'gray'
	},
	{
		label: 'Negro',
		color: 'black'
	},
];
const sizes: number[] = [5, 6, 7, 8, 9, 10];

function App() {
	const [data, setData] = useState<ProductList>();
	const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
	const [selectedColorsOptions, setSelectedColorsOptions] = useState<string[]>([]);
	const [selectedSizesOptions, setSelectedSizesOptions] = useState<number[]>([]);

	const handleFetchData = useCallback(async () => {
		try {
			let filters = '';

			if (selectedColorsOptions.length) {
				filters += `colors=${JSON.stringify(selectedColorsOptions)}`;
			}

			if (selectedSizesOptions.length) {
				filters += `${filters ? '&' : ''}sizes=${JSON.stringify(selectedSizesOptions)}`;
			}

			if (priceRange.length) {
				filters += `${filters ? '&' : ''}min=${priceRange[0]}&max=${priceRange[1]}`;
			}

			const response = await axios.get<ProductList>(`${import.meta.env.VITE_API_URL}/products?${filters}`)
			setData(response.data)
		} catch (error) {
			console.log(error);
		}

	}, [selectedColorsOptions, selectedSizesOptions, priceRange])

	const formatCurrency = (value: number): string => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value);
	};

	const valuetext = (value: number) => {
		return `${value}`;
	}

	const handleColorCheckboxChange = (option: string) => {
		setSelectedColorsOptions((prev) =>
			prev.includes(option)
				? prev.filter((item) => item !== option)
				: [...prev, option]
		);
	};

	const handleSizeCheckboxChange = (option: number) => {
		setSelectedSizesOptions((prev) =>
			prev.includes(option)
				? prev.filter((item) => item !== option)
				: [...prev, option]
		);
	};

	const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
		setPriceRange(newValue as number[]);
	};

	const columns: GridColDef<Product>[] = [
		{
			field: 'name',
			headerName: 'Nombre',
			sortable: true,
			flex: 1,
			valueGetter: (value, row) => row.name,
		},
		{
			field: 'stock',
			headerName: 'Cantidad disponible',
			sortable: true,
			flex: 1,
			valueGetter: (value, row) => row.stock,
		},
		{
			field: 'price',
			headerName: 'Precio',
			sortable: true,
			flex: 1,
			valueGetter: (value, row) => `${formatCurrency(row.price)}`,
		},
		{
			field: 'model',
			headerName: 'Modelo',
			sortable: false,
			flex: 1,
			valueGetter: (value, row) => row.model,
		},
		{
			field: 'sizes',
			headerName: 'Tallas',
			sortable: false,
			flex: 1,
			renderCell: (params: GridRenderCellParams) => {
				return (
					<>
						<ul className='w-max mt'>
							{
								params.row.sizes?.map((size: string) => (
									<li key={size}><span className='font-bold'>{size}</span></li>
								))
							}
						</ul>
					</>
				);
			}
		},
		{
			field: 'colors',
			headerName: 'Colores',
			sortable: false,
			flex: 1,
			renderCell: (params: GridRenderCellParams) => {
				return (
					<>
						<ul className='w-max mt'>
							{
								params.row.colors?.map((color: string) => (
									<li key={color}><span className='font-bold'>{color}</span></li>
								))
							}
						</ul>
					</>
				);
			}
		},
		{
			field: 'created_at',
			headerName: 'Fecha de creación',
			sortable: true,
			flex: 1,
			valueGetter: (value, row) => row.created_at,
		},
		{
			field: 'description',
			headerName: 'Descripción',
			sortable: false,
			flex: 1,
			valueGetter: (value, row) => row.description,
		},
		{
			field: 'active',
			headerName: 'Estado',
			sortable: true,
			flex: 1,
			renderCell: (params: GridRenderCellParams) => {
				return (
					<>
						{params.row.active ? (
							<Chip label="Activo" color="success" />
						) : (
							<Chip label="Inactivo" color="error" />
						)}
					</>
				);
			}
		},
	];

	useEffect(() => {
		handleFetchData()
	}, [handleFetchData])

	return (
		<>
			<div className="flex flex-col gap-4">
				<Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
					Listado de calzados.
				</Typography>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={4} md={3}>
						<Card elevation={3}>
							<CardContent>
								<Box sx={{ width: '100%' }}>
									<Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
										Filtros
									</Typography>
									<Divider />
									<Typography variant="subtitle1" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
										Colores:
									</Typography>
									<FormGroup sx={{ marginLeft: 5 }}>
										{
											colors.map((color) => (
												<FormControlLabel key={color.label} control={<Checkbox value={color.label} sx={{
													color: `${color.color}`, '&.Mui-checked': {
														color: `${color.color}`,
													},
												}} onChange={() => handleColorCheckboxChange(color.label)} />} label={color.label} />
											))
										}
									</FormGroup>
									<Typography variant="subtitle1" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
										Tallas:
									</Typography>
									<FormGroup sx={{ marginLeft: 5 }}>
										{
											sizes.map((size) => (
												<FormControlLabel key={size} control={<Checkbox value={size} onChange={() => handleSizeCheckboxChange(size)} />} label={size} />
											))
										}
									</FormGroup>
									<Typography variant="subtitle1" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
										Rango de precio:
									</Typography>
									<Slider
										max={1000}
										getAriaLabel={() => 'Rango de precio'}
										value={priceRange}
										onChange={handlePriceRangeChange}
										valueLabelDisplay="auto"
										getAriaValueText={valuetext}
									/>
								</Box>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={12} sm={8} md={9}>
						<Card elevation={3}>
							<CardContent>
								<Box sx={{ width: '100%', textAlign: 'center' }}>
									<DataGrid
										rows={data?.data || []}
										columns={columns}
										initialState={{ pagination: { paginationModel } }}
										pageSizeOptions={[5, 10]}
										sx={{ border: 0 }}
										disableRowSelectionOnClick
										disableColumnMenu
										getRowHeight={() => 'auto'}
										slots={{
											toolbar: GridToolbar,
											noRowsOverlay: () => <div className="text-center">No se encontraron datos...</div>
										}}
										slotProps={{
											toolbar: {
												csvOptions: { disableToolbarButton: true },
												printOptions: { disableToolbarButton: true },
												showQuickFilter: true
											}
										}}
										localeText={esES.components.MuiDataGrid.defaultProps.localeText}
									/>
								</Box>
							</CardContent>
						</Card >
					</Grid>
				</Grid>
			</div >
		</>
	)
}

export default App
