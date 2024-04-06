import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, useTheme, Stack, Grid } from '@mui/material';
import { StyledButton } from '@/components/styled-button';
import { IconPrinter } from '@tabler/icons-react';
import ReactToPrint from "react-to-print";
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import HtmlEditor, {
    Toolbar,
    MediaResizing,
    ImageUpload,
    Item,
} from 'devextreme-react/html-editor';

const sizeValues = ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt'];
const fontValues = [
    'Arial',
    'Courier New',
    'Georgia',
    'Impact',
    'Lucida Console',
    'Tahoma',
    'Times New Roman',
    'Verdana',
];
const headerValues = [false, 1, 2, 3, 4, 5];
const fontSizeOptions = {
    inputAttr: {
        'aria-label': 'Font size',
    },
};
const fontFamilyOptions = {
    inputAttr: {
        'aria-label': 'Font family',
    },
};
const headerOptions = {
    inputAttr: {
        'aria-label': 'Font family',
    },
};
export interface Tab {
    name: string,
    value: ('file' | 'url')[],
}
export const tabs: Tab[] = [
    { name: 'From This Device', value: ['file'] },
    { name: 'From the Web', value: ['url'] },
    { name: 'Both', value: ['file', 'url'] },
];

export const markup = `
<table style="width: 66.0118%;">
<tbody>
<tr>
<td style="width: 23.8741%;">&nbsp;</td>
<td style="width: 40.1259%;">
<p><strong>&nbsp;</strong></p>
</td>
</tr>
<tr>
<td style="text-align: center; width: 23.8741%;">
<p><strong>&nbsp;</strong></p>
<p><strong>C&Ocirc;NG TY CỔ PHẦN</strong></p>
<p><strong>GIẢI PH&Aacute;P C&Ocirc;NG NGHỆ GD VIỆT NAM</strong></p>
<p><strong>-----------------------</strong></p>
</td>
<td style="text-align: center; width: 40.1259%;">
<p><strong>CỘNG H&Ograve;A X&Atilde; HỘI CHỦ NGHĨA VIỆT NAM</strong></p>
<p><strong>Độc lập &ndash; Tự do &ndash; Hạnh ph&uacute;c</strong></p>
<p><strong>-----------------------</strong></p>
<p>&nbsp;</p>
</td>
</tr>
<tr>
<td style="width: 64%;" colspan="2">
<p style="text-align: right;"><em>TP Hồ Ch&iacute; Minh, ng&agrave;y 13 th&aacute;ng 03 năm 2024</em></p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;&nbsp;</p>
<p style="text-align: center;"><strong>ĐƠN XIN NGHỈ PH&Eacute;P</strong></p>
<table width="673">
<tbody>
<tr>
<td width="145">
<p>K&iacute;nh gửi:</p>
</td>
<td width="528">
<p>- Ban Gi&aacute;m đốc C&ocirc;ng ty CP Giải Ph&aacute;p C&ocirc;ng Nghệ GD Việt Nam;</p>
<p>- Ph&ograve;ng H&agrave;nh Ch&iacute;nh Kế To&aacute;n;</p>
<p>- Ph&ograve;ng Kỹ thuật;</p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
<p>T&ocirc;i t&ecirc;n l&agrave;: Trương Ph&uacute;c Vĩnh</p>
<p>Chức vụ: Nh&acirc;n vi&ecirc;n</p>
<p>T&ocirc;i viết đơn n&agrave;y k&iacute;nh mong BGĐ cho t&ocirc;i nghỉ ng&agrave;y thứ Tư (13/03/2024).</p>
<p>L&yacute; do: Bị bệnh, sức khoẻ kh&ocirc;ng đảm bảo để thực hiện c&ocirc;ng việc.</p>
<p>T&ocirc;i sẽ sắp xếp c&ocirc;ng việc trước v&agrave; sau khi nghỉ ph&eacute;p để kh&ocirc;ng ảnh hưởng tới c&ocirc;ng việc chung của c&ocirc;ng ty.</p>
<p>K&iacute;nh mong BGĐ chấp nhận.</p>
<p>T&ocirc;i xin ch&acirc;n th&agrave;nh cảm ơn!</p>
<p>&nbsp;</p>
<table>
<tbody>
<tr>
<td width="164">
<p>Gi&aacute;m Đốc</p>
<p><em>(K&yacute;, ghi r&otilde; họ t&ecirc;n)</em></p>
</td>
<td width="164">
<p>H&agrave;nh ch&iacute;nh</p>
<p><em>(K&yacute;, ghi r&otilde; họ t&ecirc;n)</em></p>
</td>
<td width="164">
<p>Trưởng bộ phận</p>
<p><em>(K&yacute;, ghi r&otilde; họ t&ecirc;n)</em></p>
</td>
<td width="164">
<p>Người đề nghị</p>
<p><em>(K&yacute;, ghi r&otilde; họ t&ecirc;n)</em></p>
</td>
</tr>
</tbody>
</table>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p><strong>&nbsp; &nbsp;&nbsp;</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
<p><strong>&nbsp;</strong></p>

`;

const tabLabel = { 'aria-label': 'Tab' };
const TabHtmlEditor = () => {
    const [isMultiline, setIsMultiline] = useState(true);
    const [currentTab, setCurrentTab] = useState(tabs[2].value);
    const theme = useTheme()
    const [html, setHtml] = useState(markup)

    const printFile = () => {
        // Tính toán kích thước cửa sổ in
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        // Tạo một cửa sổ in mới và đặt kích thước sao cho nó toàn màn hình
        const printWindow = window.open('', '', `width=${windowWidth},height=${windowHeight},left=0,top=0`);
        if (printWindow) {
            // Viết nội dung HTML vào cửa sổ in
            printWindow.document.write(html);
            // Đóng việc viết và in cửa sổ in
            printWindow.document.close();
            // Chỉ in nội dung cửa sổ, không in các phần khác của trang
            printWindow.print();
        }
    };
    console.log(html);

    const componentRef = useRef(null);

    const onBeforeGetContentResolve = useRef<any>(null);

    const [loading, setLoading] = useState(false);
    const [text, setText] = useState("old boring text");

    const handleAfterPrint = useCallback(() => {
        console.log("`onAfterPrint` called");
    }, []);

    const handleBeforePrint = useCallback(() => {
        console.log("`onBeforePrint` called");
    }, []);

    const handleOnBeforeGetContent = useCallback(() => {
        console.log("`onBeforeGetContent` called");
        setLoading(true);
        setText("Loading new text...");

        return new Promise<void>((resolve) => {
            onBeforeGetContentResolve.current = resolve;

            setTimeout(() => {
                setLoading(false);
                setText("New, Updated Text!");
                resolve();
            }, 2000);
        });
    }, [setLoading, setText]);

    useEffect(() => {
        if (
            text === "New, Updated Text!" &&
            typeof onBeforeGetContentResolve.current === "function"
        ) {
            onBeforeGetContentResolve.current();
        }
    }, [text]);

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, []);

    const reactToPrintTrigger = useCallback(() => {
        return (
            <StyledButton
                startIcon={<IconPrinter stroke={2} />}
                variant="contained" size='large'>In đơn
            </StyledButton>
        )
    }, []);


    return (
        <Box width='100%' bgcolor={theme.palette.background.default}>

            <Box display='flex' alignItems='flex-start' justifyContent='space-between' bgcolor={theme.palette.background.default} gap={3} >
                <Box width='50%' bgcolor={theme.palette.background.paper}>
                    <Box>
                        <HtmlEditor height="65vh" defaultValue={markup} onValueChange={(e) => setHtml(e)}>
                            <MediaResizing enabled={true} />
                            <ImageUpload tabs={currentTab} fileUploadMode="base64" />
                            <Toolbar multiline={isMultiline} >
                                <Item name="undo" />
                                <Item name="redo" />
                                <Item name="separator" />
                                <Item name="size" acceptedValues={sizeValues} options={fontSizeOptions} />
                                <Item name="font" acceptedValues={fontValues} options={fontFamilyOptions} />
                                <Item name="separator" />
                                <Item name="bold" />
                                <Item name="italic" />
                                <Item name="strike" />
                                <Item name="underline" />
                                <Item name="separator" />
                                <Item name="alignLeft" />
                                <Item name="alignCenter" />
                                <Item name="alignRight" />
                                <Item name="alignJustify" />
                                <Item name="separator" />
                                <Item name="orderedList" />
                                <Item name="bulletList" />
                                <Item name="separator" />
                                <Item name="header" acceptedValues={headerValues} options={headerOptions} />
                                <Item name="separator" />
                                <Item name="color" />
                                <Item name="background" />
                                <Item name="separator" />
                                <Item name="link" />
                                <Item name="image" />
                                <Item name="separator" />
                                <Item name="clear" />
                                <Item name="codeBlock" />
                                <Item name="blockquote" />
                                <Item name="separator" />
                                <Item name="insertTable" />
                                <Item name="deleteTable" />
                                <Item name="insertRowAbove" />
                                <Item name="insertRowBelow" />
                                <Item name="deleteRow" />
                                <Item name="insertColumnLeft" />
                                <Item name="insertColumnRight" />
                                <Item name="deleteColumn" />
                            </Toolbar>
                        </HtmlEditor>




                    </Box>
                </Box>
                <Box width='50%' bgcolor={theme.palette.background.paper} p={3} display='flex' flexDirection='column' gap={3}>
                    <Box display='flex' alignItems='center' justifyContent='space-between'  >
                        <Typography>Nội dung in</Typography>
                        <ReactToPrint
                            content={reactToPrintContent}
                            documentTitle="In đơn xin nghỉ phép"
                            onAfterPrint={handleAfterPrint}
                            onBeforeGetContent={handleOnBeforeGetContent}
                            onBeforePrint={handleBeforePrint}
                            removeAfterPrint
                            trigger={reactToPrintTrigger}


                        />
                    </Box>

                    {loading && <p className="indicator">Loading...</p>}
                    <Box border={`1px solid ${theme.palette.text.secondary}`}>
                        <div ref={componentRef} dangerouslySetInnerHTML={{ __html: html }} />
                    </Box>

                </Box>
            </Box>

        </Box>
    )
}
export default TabHtmlEditor