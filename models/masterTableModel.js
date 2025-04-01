
export class MasterTableModel {
    constructor(data) {

        this.entryCreatedOn = data.entryCreatedOn || new Date();
        this.dateofBooking = data.dateofBooking;
        this.dateOfJourney = data.dateOfJourney;
        this.modeOfPayment = data.modeOfPayment;
        this.service = data.service;
        this.description = data.description;
        this.PNR = data.PNR;
        this.systemRef = data.systemRef;
        this.vendor = data.vendor;
        this.vendorGST = data.vendorGST;
        this.depCity = data.depCity;
        this.arrCity = data.arrCity;
        this.passengerName = data.passengerName;
        this.paymentParty = data.paymentParty;
        this.paymentPartyGST = data.paymentPartyGST;
        this.netAmount = data.netAmount;
        this.markup = data.markup;
        this.gst = data.gst;
        this.totalAmount = data.totalAmount;
        this.modeOfPaymentForClient = data.modeOfPaymentForClient;
        this.amount = data.amount;
        this.refundDate = data.refundDate;
        this.refundAmount = data.refundAmount;
        this.cancelCharge = data.cancelCharge;
        this.refundMode = data.refundMode;
    }
}
