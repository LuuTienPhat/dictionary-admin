const { default: axios } = require("axios");
const qs = require("qs");
const static = require("../static");
const staticFunc = require("../staticFunction");
const moment = require("moment");

const originalUrl = `${static.ADMIN_PATH}${static.INVOICE_PATH}`;

const maxAge = 1000 * 60 * 60 * 24;
const cookieOption = { maxAge: maxAge, httpOnly: true };

const invoiceHelper = {
  getPrice: function (productId, invoiceDetails) {
    console.log(invoiceDetails);
    for (item of invoiceDetails) {
      if (item.product.id == productId) {
        return item.price;
      }
    }
    return 0;
  },
  getQuantity: function (productId, invoiceDetails) {
    for (item of invoiceDetails) {
      if (item.product.id == productId) {
        return item.quantity;
      }
    }
    return 0;
  },

  getTotalPrice: function (invoiceDetails) {
    let result = 0;
    for (item of invoiceDetails) {
      result += invoiceDetails.price * invoiceDetails.quantity;
    }
    return result;
  },

  getInvoiceDetail: function (invoiceDetails, productId) {
    for (let i = 0; i < invoiceDetails.length; i++) {
      if (invoiceDetails[i].product.id == productId) {
        return i;
      }
    }
    return -1;
  },

  getProduct: async function (productId) {
    let product = null;
    await axios
      .get(`${static.API_URL}${static.API_PRODUCT_PATH}/${productId}`)
      .then((res) => res.data)
      .then((data) => {
        if (data.statusCode == 200) {
          product = data.data;
        }
      });

    return product;
  },
};

exports.returnInvoicePage = async (req, res, next) => {
  let { p } = req.query;
  let { s } = req.query;

  let invoices = [];
  let notyfOptions = null;
  let notyfOptionsFlash = null;
  let count = 58000;
  let perPage = 20;
  let offset = 0;
  let limit = 20;
  let total = 0;
  let search = "";
  let apiUrl = "";

  if (p != null) {
    offset = parseInt(p) - 1;
  }
  apiUrl = `${static.API_URL}${static.API_INVOICE_PATH}?offset=${offset}&limit=${limit}`;

  if (s != null) {
    search = s;
    apiUrl = `${static.API_URL}${static.API_INVOICE_PATH}?search=${encodeURIComponent(search)}`;
  }

  await axios.get(`${static.API_URL}${static.API_INVOICE_PATH}${static.API_COUNT_PATH}`).then((res) => (total = res.data.data));

  await axios
    .get(apiUrl)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        invoices = data.data;
        count = invoices.length;
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      if (s != null) total = invoices.length;

      notyfOptionsFlash = await req.consumeFlash("notyfOptions");
      if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];
    })
    .catch((err) => console.log(err));

  res.render(`${static.VIEWS_PAGE_DIR}${static.INVOICE_DIR}${static.INVOICE_VIEW}`, {
    title: "Invoices",
    breadcrumb: staticFunc.initBreadcrumbOptions("Invoices", "Management", false),
    invoices: invoices,
    notyfOptions: notyfOptions,
    originalUrl: originalUrl,
    pagination: staticFunc.initPagination(perPage, total, count, Math.ceil(total / perPage), offset + 1),
    keyword: s != null ? search : "",
    modal: { content: static.DELETE_INVOICE_QUESTION },
  });
};

exports.returnAddInvoicePage = async (req, res, next) => {
  res.clearCookie("invoice");
  let invoiceTypes = [];

  await axios
    .get(`${static.API_URL}${static.API_INVOICE_PATH}/types`)
    .then((res) => res.data)
    .then((data) => {
      if (data.statusCode == 200) {
        invoiceTypes = data.data;
      }
    });

  res.render(`${static.VIEWS_PAGE_DIR}${static.INVOICE_DIR}${static.ADD_INVOICE_VIEW}`, {
    title: "Add Invoice",
    breadcrumb: staticFunc.initBreadcrumbOptions("Invoices", "New", true),
    notyfOptions: null,
    originalUrl: originalUrl,
    invoiceTypes: invoiceTypes,
    invoiceId: Math.floor(Math.random() * 10000),
    previousPageLink: "",
  });
};

exports.redirectAddInvoiceDetail = async (req, res, next) => {
  const { id, invoiceTypeId, date, time } = req.body;
  const { userId } = req.cookies;
  let notyfOptions = null;

  let dateTime = `${date} ${time}`;
  let format = moment(dateTime);
  console.log(format.format("MMM DD, YYYY HH:mm"));

  let invoice = {
    id: id,
    invoiceType: {
      id: invoiceTypeId,
    },
    user: {
      id: userId,
    },
    invoiceDetails: [],
    createdDate: dateTime,
  };
  res.cookie("invoice", JSON.stringify(invoice), cookieOption);
  res.redirect(`${originalUrl}/add/invoice-detail`);
};

exports.returnAddInvoiceDetailPage = async (req, res, next) => {
  let products = [];
  let { invoice } = req.cookies;

  invoice = JSON.parse(invoice);

  let notyfOptions = null;
  let notyfOptionsFlash = await req.consumeFlash("notyfOptions");
  if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];

  await axios
    .get(`${static.API_URL}${static.API_PRODUCT_PATH}`)
    .then((res) => res.data)
    .then((data) => {
      if (data.statusCode == 200) {
        products = data.data;
      }
    });

  res.render(`${static.VIEWS_PAGE_DIR}${static.INVOICE_DIR}${static.ADD_INVOICE_DETAIL_VIEW}`, {
    title: "Add Invoice Detail",
    breadcrumb: staticFunc.initBreadcrumbOptions("Invoices", "New", true),
    notyfOptions: notyfOptions,
    originalUrl: originalUrl,
    products: products,
    invoice: invoice,
    invoiceHelper: invoiceHelper,
    inv: JSON.stringify(invoice),
    nextPageLink: `${originalUrl}/add/preview`,
    previousPageLink: `${originalUrl}/add`,
  });
};

exports.returnPreviewInvoicePage = async (req, res, next) => {
  let { invoice } = req.cookies;
  invoice = JSON.parse(invoice);

  let notyfOptions = null;
  let notyfOptionsFlash = await req.consumeFlash("notyfOptions");
  if (notyfOptionsFlash.length != 0) notyfOptions = notyfOptionsFlash[0];

  res.render(`${static.VIEWS_PAGE_DIR}${static.INVOICE_DIR}${static.INVOICE_DETAIL_VIEW}`, {
    title: "Invoice Preview",
    breadcrumb: staticFunc.initBreadcrumbOptions("Invoices", "Add", true),
    notyfOptions: notyfOptions,
    originalUrl: originalUrl,
    invoice: invoice,
    invoiceHelper: invoiceHelper,
    inv: JSON.stringify(invoice),
    nextPageLink: `${originalUrl}/add/finish`,
    previousPageLink: `${originalUrl}/add/invoice-detail`,
  });
};

exports.returnInvoiceDetailPage = async (req, res, next) => {
  const id = req.params.id;
  let invoice = null;

  await axios
    .get(`${static.API_URL}${static.API_INVOICE_PATH}/${id}`)
    .then((res) => res.data)
    .then((data) => {
      invoice = data.data;

      res.render(`${static.VIEWS_PAGE_DIR}${static.INVOICE_DIR}${static.INVOICE_DETAIL_VIEW}`, {
        title: invoice.id,
        breadcrumb: staticFunc.initBreadcrumbOptions("Invoice", invoice.id, true),
        invoice: invoice,
        notyfOptions: null,
        originalUrl: originalUrl,
        invoiceHelper: invoiceHelper,
        nextPageLink: ``,
        previousPageLink: ``,
      });
    })
    .catch((err) => console.log(err));
};

exports.addInvoice = async (req, res, next) => {
  let { invoice } = req.cookies;
  invoice = JSON.parse(invoice);
  let notyfOptions = null;
  let invoicesDetails = [];

  for (item of invoice.invoiceDetails) {
    let i = {
      productId: item.product.id,
      quantity: item.quantity,
      price: item.price,
    };
    invoicesDetails.push(i);
  }

  await axios
    .post(`${static.API_URL}${static.API_INVOICE_PATH}`, {
      id: invoice.id,
      createdDate: invoice.createdDate,
      invoiceTypeId: invoice.invoiceType.id,
      userId: invoice.user.id,
      invoiceDetails: invoicesDetails,
    })
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect("/admin/invoices");
    })
    .catch((err) => console.log(err));
};

//ADD INVOICE DETAIL
exports.updateInvoiceDetail = async (req, res, next) => {
  let { invoice } = req.cookies;
  invoice = JSON.parse(invoice);

  const { productId, invoiceId, oldQuantity, newQuantity, price } = req.body;
  let notyfOptions = null;

  let invoiceDetails = invoice.invoiceDetails;
  let index = invoiceHelper.getInvoiceDetail(invoiceDetails, productId);
  if (index == -1) {
    let product = await invoiceHelper.getProduct(productId);

    let invoiceDetail = {
      product: {
        id: productId,
        quantity: product.quantity,
        unit: product.unit,
        name: product.name,
      },
      quantity: newQuantity,
      price: price,
    };
    invoice.invoiceDetails.push(invoiceDetail);
  } else {
    invoiceDetails[index].quantity = newQuantity;
    invoiceDetails[index].price = price;
  }

  notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, "Add invoice detail successfully!");
  await req.flash("notyfOptions", notyfOptions);

  res.clearCookie("invoice");
  res.cookie("invoice", JSON.stringify(invoice), cookieOption);
  res.redirect(`${originalUrl}/add/invoice-detail`);
};

exports.deleteInvoiceDetail = async (req, res, next) => {
  let { invoice } = req.cookies;
  invoice = JSON.parse(invoice);

  const { productId } = req.params;
  let notyfOptions = null;

  let invoiceDetails = invoice.invoiceDetails;
  let index = invoiceHelper.getInvoiceDetail(invoiceDetails, productId);
  if (index == -1) {
    notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, "Invoice detail not found!");
  } else {
    invoiceDetails.splice(index, 1);
    notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, "Delete invoice detail successfully!");
  }

  await req.flash("notyfOptions", notyfOptions);

  res.clearCookie("invoice");
  res.cookie("invoice", JSON.stringify(invoice), cookieOption);
  res.redirect(`${originalUrl}/add/invoice-detail`);
};

exports.deleteInvoice = async (req, res, next) => {
  const { id } = req.params;
  let notyfOptions = null;

  await axios
    .delete(`${static.API_URL}${static.API_INVOICE_PATH}/${id}`)
    .then((res) => res.data)
    .then(async (data) => {
      if (data.statusCode == 200) {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_SUCCESS, data.message);
      } else {
        notyfOptions = staticFunc.initNotyfOptions(static.NOTYF_DANGER, data.message);
      }

      await req.flash("notyfOptions", notyfOptions);
      res.redirect("/admin/invoices");
    })
    .catch((err) => console.log(err));
};
