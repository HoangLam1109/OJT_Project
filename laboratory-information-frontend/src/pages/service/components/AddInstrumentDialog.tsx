import { useState, useEffect, useCallback } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../../../components/common/dialog';
import Button from '../../../components/common/button';
import { Label } from '../../../components/common/label';
import { Input } from '../../../components/common/input';
import { toast } from 'sonner';
import type { Instrument } from '../types/Instrument';
import { instrumentsService } from '../../../service/instrumentsService';
import { useTranslation } from 'react-i18next';

interface AddInstrumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddInstrument: (instrument: Instrument) => void;
}

interface InstrumentFormData {
    instrument_name: string;
    instrument_type: string;
    manufacturer: string;
    location: string;
}

interface ValidationErrors {
    instrument_name?: string;
    instrument_type?: string;
    manufacturer?: string;
    location?: string;
}

export function AddInstrumentDialog({
    open,
    onOpenChange,
    onAddInstrument,
}: AddInstrumentDialogProps) {
    const { t } = useTranslation();
    const [newInstrument, setNewInstrument] = useState<InstrumentFormData>({
        instrument_name: '',
        instrument_type: '',
        manufacturer: '',
        location: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    const resetForm = useCallback(() => {
        setNewInstrument({
            instrument_name: '',
            instrument_type: '',
            manufacturer: '',
            location: '',
        });
        setErrors({});
    }, []);

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            resetForm();
            setIsSubmitting(false);
        }
    }, [open, resetForm]);

    const validateField = (field: keyof InstrumentFormData, value: string): string | undefined => {
        switch (field) {
            case 'instrument_name':
                if (!value.trim()) {
                    return t('service.instrument.validation.instrumentNameRequired');
                }
                if (value.trim().length < 3) {
                    return t('service.instrument.validation.instrumentNameMinLength');
                }
                if (value.trim().length > 200) {
                    return t('service.instrument.validation.instrumentNameMaxLength');
                }
                break;
            case 'instrument_type':
                if (!value.trim()) {
                    return t('service.instrument.validation.instrumentTypeRequired');
                }
                if (value.trim().length < 3) {
                    return t('service.instrument.validation.instrumentTypeMinLength');
                }
                if (value.trim().length > 100) {
                    return t('service.instrument.validation.instrumentTypeMaxLength');
                }
                break;
            case 'manufacturer':
                if (value.trim() && value.trim().length < 2) {
                    return t('service.instrument.validation.manufacturerMinLength');
                }
                if (value.trim().length > 100) {
                    return t('service.instrument.validation.manufacturerMaxLength');
                }
                break;
            case 'location':
                if (value.trim() && value.trim().length < 2) {
                    return t('service.instrument.validation.locationMinLength');
                }
                if (value.trim().length > 100) {
                    return t('service.instrument.validation.locationMaxLength');
                }
                break;
        }
        return undefined;
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        
        const instrumentNameError = validateField('instrument_name', newInstrument.instrument_name);
        if (instrumentNameError) newErrors.instrument_name = instrumentNameError;

        const instrumentTypeError = validateField('instrument_type', newInstrument.instrument_type);
        if (instrumentTypeError) newErrors.instrument_type = instrumentTypeError;

        const manufacturerError = validateField('manufacturer', newInstrument.manufacturer);
        if (manufacturerError) newErrors.manufacturer = manufacturerError;

        const locationError = validateField('location', newInstrument.location);
        if (locationError) newErrors.location = locationError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldChange = (field: keyof InstrumentFormData, value: string) => {
        setNewInstrument((prev) => ({ ...prev, [field]: value }));
        
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handleBlur = (field: keyof InstrumentFormData) => {
        const error = validateField(field, newInstrument[field]);
        if (error) {
            setErrors((prev) => ({ ...prev, [field]: error }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error(t('service.instrument.validation.checkFields'));
            return;
        }

        setIsSubmitting(true);
        try {
            const payload: Partial<Instrument> = {
                instrument_name: newInstrument.instrument_name.trim(),
                instrument_type: newInstrument.instrument_type.trim(),
                manufacturer: newInstrument.manufacturer.trim() || undefined,
                location: newInstrument.location.trim() || undefined,
            };

            const createdInstrument = await instrumentsService.createInstrument(payload);
            onAddInstrument(createdInstrument);
            onOpenChange(false);
            resetForm();
            toast.success(t('service.instrument.addSuccess'));
        } catch (error) {
            const message = error instanceof Error ? error.message : t('service.instrument.cannotAddInstrument');
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-blue-700">
                        {t('service.instrument.addDialog.title')}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                        {t('service.instrument.addDialog.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    {/* Instrument Name */}
                    <div className="space-y-2">
                        <Label htmlFor="instrument_name">{t('service.instrument.addDialog.instrumentName')} *</Label>
                        <Input
                            id="instrument_name"
                            type="text"
                            value={newInstrument.instrument_name}
                            onChange={(e) => handleFieldChange('instrument_name', e.target.value)}
                            onBlur={() => handleBlur('instrument_name')}
                            placeholder={t('service.instrument.addDialog.instrumentNamePlaceholder')}
                            className={errors.instrument_name ? 'border-red-500' : ''}
                            aria-invalid={!!errors.instrument_name}
                        />
                        {errors.instrument_name && (
                            <p className="text-sm text-red-500 mt-1">{errors.instrument_name}</p>
                        )}
                    </div>

                    {/* Instrument Type */}
                    <div className="space-y-2">
                        <Label htmlFor="instrument_type">{t('service.instrument.addDialog.instrumentType')} *</Label>
                        <Input
                            id="instrument_type"
                            type="text"
                            value={newInstrument.instrument_type}
                            onChange={(e) => handleFieldChange('instrument_type', e.target.value)}
                            onBlur={() => handleBlur('instrument_type')}
                            placeholder={t('service.instrument.addDialog.instrumentTypePlaceholder')}
                            className={errors.instrument_type ? 'border-red-500' : ''}
                            aria-invalid={!!errors.instrument_type}
                        />
                        {errors.instrument_type && (
                            <p className="text-sm text-red-500 mt-1">{errors.instrument_type}</p>
                        )}
                    </div>

                    {/* Manufacturer */}
                    <div className="space-y-2">
                        <Label htmlFor="manufacturer">{t('service.instrument.addDialog.manufacturer')}</Label>
                        <Input
                            id="manufacturer"
                            type="text"
                            value={newInstrument.manufacturer}
                            onChange={(e) => handleFieldChange('manufacturer', e.target.value)}
                            onBlur={() => handleBlur('manufacturer')}
                            placeholder={t('service.instrument.addDialog.manufacturerPlaceholder')}
                            className={errors.manufacturer ? 'border-red-500' : ''}
                            aria-invalid={!!errors.manufacturer}
                        />
                        {errors.manufacturer && (
                            <p className="text-sm text-red-500 mt-1">{errors.manufacturer}</p>
                        )}
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <Label htmlFor="location">{t('service.instrument.addDialog.location')}</Label>
                        <Input
                            id="location"
                            type="text"
                            value={newInstrument.location}
                            onChange={(e) => handleFieldChange('location', e.target.value)}
                            onBlur={() => handleBlur('location')}
                            placeholder={t('service.instrument.addDialog.locationPlaceholder')}
                            className={errors.location ? 'border-red-500' : ''}
                            aria-invalid={!!errors.location}
                        />
                        {errors.location && (
                            <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        {t('service.instrument.cancel')}
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? t('service.instrument.addDialog.adding') : t('service.instrument.addDialog.addButton')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
