import SearchNoButtonSection from "@/components/search/SearchNoButton";
import useCirculars from "@/hooks/useCirculars";
import useProducts from "@/hooks/useProducts";
import { Box, Button, Card, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import TableProducts from "../table-products/TableProducts";
import TableFormListProductsInEstimates from "./TableFormListProductsInEstimates";
import * as yup from 'yup';
import { useFormik } from "formik";
export const validationEstimatesSchema = yup.object({
    tenDuToan: yup
        .string()
        .required('Vui lòng nhập tên dự toán'),
    sanPham: yup
        .array()
        .min(1, "Vui lòng nhập sản phẩm"),

});
const TableListEstimates = () => {
    const [contentSearch, setContentSearch] = useState<string>('');
    const [thongTuID, setThongTuID] = useState<number>(0);
    const [entityError, setEntityError] = useState(null);

    const formik = useFormik({
        initialValues: {
            tenDuToan: '',

        },
        validationSchema: validationEstimatesSchema,
        onSubmit: async (values) => {
            setEntityError(null);
            try {


            } catch (error: any) {
                console.log('check error', error);
                setEntityError(error.response.data);

            }

        },
    });



    const { getAllProducts, addProducts, dataProducts, isLoadding } = useProducts()
    const filterDataProducts = useMemo(() => {
        if (!dataProducts || dataProducts.length === 0) {
            return [];
        }

        return dataProducts.filter((item) => {
            const matchesSearch = !contentSearch || (item.tenSanPham && item.tenSanPham.includes(contentSearch)) || item.maSanPham.includes(contentSearch);

            // Nếu cả khoiLopID, monHocID và thongTuID đều bằng 0, không cần kiểm tra khoiLop, monHoc và thongTu
            if (thongTuID === 0) {
                return matchesSearch;
            }

            const matchesThongTuID = thongTuID === 0 || (item.thongTu && item.thongTu.some(thongTu => thongTu.thongTuID === thongTuID));

            return matchesSearch && matchesThongTuID;
        });
    }, [contentSearch, dataProducts, thongTuID]);
    return (
        <>
            <Grid container sx={{ mb: 3 }} >
                <Grid item xs={6}>
                    <Typography sx={{ mb: 1.5, fontWeight: 'bold' }} >Tên dự toán <span className="required_text">(*)</span> </Typography>
                    <TextField
                        variant="outlined"
                        fullWidth
                        id="tenDuToan"
                        name="tenDuToan"
                        value={formik.values.tenDuToan}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.tenDuToan && Boolean(formik.errors.tenDuToan)}
                    />
                    {
                        formik.touched.tenDuToan && Boolean(formik.errors.tenDuToan) && (
                            <FormHelperText className='required_text'> {formik.errors.tenDuToan ? formik.errors.tenDuToan.toString() : ''}</FormHelperText>
                        )
                    }
                </Grid>
            </Grid>
            <Grid container>
                <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 'bold' }} > Danh sách sản phẩm dự toán </Typography>

            </Grid>
            <Grid container  >
                {filterDataProducts.length > 0 ?
                    <Card variant="outlined">
                        <Box
                            display='flex'
                            justifyContent='center'
                            alignItems='flex-start'
                            width='100%'
                            my={3}
                            gap={3}

                        >
                            {/* <TableFormListProductsInEstimates isListProductsInEstimates={true} rows={filterDataProducts} isAdmin={true} /> */}
                        </Box>
                    </Card>
                    :
                    <Box
                        display='flex'
                        justifyContent='center'
                        alignItems='flex-start'
                        width='100%'
                        my={6}
                        gap={3}
                    >
                        Không có dữ liệu
                    </Box>
                }
            </Grid>
        </>

    );
}
export default TableListEstimates

